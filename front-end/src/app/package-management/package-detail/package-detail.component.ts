import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { concatMap, filter, finalize, from, Observable, switchMap, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressService } from 'src/app/progress.service';
import { EditorService } from 'src/app/service/editor.service';
import {
  CreateImageRequest,
  CreateSubscriptionRequest,
  DeletePackageRequest,
  DeleteSubscriptionRequest,
  FieldMask,
  GetUserRequest,
  ImageType,
  ListSubscriptionsRequest,
  ListSubscriptionsResponse,
  ListTagsRequest,
  Package,
  ResourceState,
  Subscription,
  Tag,
  UpdatePackageRequest,
  User,
} from '../../../proto/san11-platform.pb';
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { UploadService } from '../../service/upload.service';
import { increment } from '../../utils/number_util';
import { getCategoryId, getDefaultPackageScreenshot, getPackageUrl } from '../../utils/package_util';
import { getFullUrl, parseName } from '../../utils/resrouce_util';
import { getUserUri, isAdmin, loadUser, signedIn } from '../../utils/user_util';

const DESCRIPTION_OVERFLOW_TOLERANCE_PX = 8;

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css'],
})
export class PackageDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('packageNameTitle') packageNameElement: ElementRef<HTMLElement>;
  @ViewChild('gallery') galleryElementCatched;
  @ViewChild('descriptionContainer') descriptionElement: ElementRef<HTMLElement>;
  @ViewChild('versionsSection') versionsSection: ElementRef<HTMLElement>;

  images: ImageItem[] = [];
  package: Package;
  author: User = new User({});

  packageNameUpdated = false;
  authorZone = false;

  descEditor_updated = false;
  descEditor_onFocus = false;
  descFolded = true;
  descriptionCanExpand = false;

  allTags: Tag[] = [];
  tagCanEdit = false;
  subscription: Subscription;
  isScreenshotDragActive = false;
  isUploadingScreenshots = false;
  screenshotUploadStatus = '';

  private readonly destroyRef = inject(DestroyRef);
  private descriptionOverflowTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
    public editorService: EditorService,
    private progressService: ProgressService,
  ) { }

  // Lifecycle

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.package = data.package;
        this.initializePage();
      });
  }

  ngAfterViewInit(): void {
    if (this.isAuthor() && this.packageNameElement?.nativeElement) {
      this.packageNameElement.nativeElement.contentEditable = 'true';
    }
  }

  ngOnDestroy(): void {
    this.clearDescriptionOverflowTimer();
  }

  // Keyboard and viewport events

  @HostListener('document:keydown.meta.enter', ['$event'])
  @HostListener('document:keydown.control.enter', ['$event'])
  onEditorSaveShortcut(event: KeyboardEvent): void {
    if (!this.descEditor_onFocus || !this.descEditor_updated) {
      return;
    }

    event.preventDefault();
    this.onUpdateDesc();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleDescriptionOverflowCheck();
  }

  // Template state

  get collectButtonText(): string {
    return this.isCollected ? '取消收藏' : '收藏';
  }

  get descriptionIsEmpty(): boolean {
    return this.descriptionText.length === 0;
  }

  get isCollected(): boolean {
    return this.subscription !== undefined;
  }

  get maxImageSizeMb(): number {
    return GlobalConstants.maxImageSize / 1024 / 1024;
  }

  private get descriptionText(): string {
    return (this.package?.description ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();
  }

  // Title and description editing

  onUpdateTitle(): void {
    const updatedPackageName = this.packageNameElement.nativeElement.innerHTML;

    this.updatePackage(
      { packageName: updatedPackageName },
      ['package_name'],
      () => {
        this.package.packageName = updatedPackageName;
        this.packageNameUpdated = false;
        this.notificationService.success('更新成功');
      },
      '更新失败',
    );
  }

  onDescEditorChange(): void {
    this.descEditor_updated = true;
    this.scheduleDescriptionOverflowCheck();
  }

  onDescriptionEditorReady(editor): void {
    this.editorService.onReady(editor);
    this.scheduleDescriptionOverflowCheck();
  }

  onUpdateDesc(): void {
    const description = this.editorService.getData();
    if (description === undefined) {
      return;
    }

    this.updatePackage(
      { description },
      ['description'],
      (updatedPackage: Package) => {
        this.package.description = updatedPackage.description;
        this.descEditor_updated = false;
        this.scheduleDescriptionOverflowCheck();
        this.notificationService.success('更新成功');
      },
      '更新失败',
    );
  }

  onDescription(): void {
    this.descFolded = false;
    this.descriptionCanExpand = false;
  }

  // Tags

  newTagSelected(newTag: Tag): void {
    if (this.package.tags.some(tag => tag.name === newTag.name)) {
      return;
    }

    this.updateTags([...this.package.tags, newTag], '添加标签成功', '添加标签失败');
  }

  removeTag(tagToRemove: Tag): void {
    const tags = this.package.tags.filter(tag => tag.name !== tagToRemove.name);
    this.updateTags(tags, '删除标签成功', '删除标签失败');
  }

  // Admin and author actions

  onApprove(): void {
    this.updatePackage(
      { state: ResourceState.NORMAL },
      ['state'],
      () => {
        this.notificationService.success('审核通过');
        this.reloadCurrentPackage();
      },
      '操作失败',
    );
  }

  onFlipHide(): void {
    const nextState = this.package.state === ResourceState.HIDDEN
      ? ResourceState.NORMAL
      : ResourceState.HIDDEN;
    const actionText = this.package.state === ResourceState.HIDDEN ? '显示' : '隐藏';

    if (!confirm(`确认要${actionText} ${this.package.packageName} 吗？`)) {
      return;
    }

    this.updatePackage(
      { state: nextState },
      ['state'],
      () => {
        this.notificationService.success('操作成功');
        this.reloadCurrentPackage();
      },
      '操作失败',
    );
  }

  onDelete(): void {
    if (!confirm(`确认要删除 ${this.package.packageName} 吗？`)) {
      return;
    }

    if (this.isAdmin()) {
      this.deletePackageImmediately();
      return;
    }

    this.updatePackage(
      { state: ResourceState.SCHEDULED_DELETE },
      ['state'],
      () => {
        this.notificationService.success('成功删除');
        this.navigateHomeAndReload();
      },
      '删除失败',
    );
  }

  // Gallery and screenshots

  onUploadScreenshots(files: FileList | null, imageInput?: HTMLInputElement): void {
    const images = Array.from(files ?? []);
    if (!images.length || this.isUploadingScreenshots) {
      return;
    }

    const validImages = images.filter(image => image.type.startsWith('image/') &&
      image.size <= GlobalConstants.maxImageSize);
    const rejectedCount = images.length - validImages.length;

    if (imageInput) {
      imageInput.value = '';
    }

    if (rejectedCount) {
      this.notificationService.warn(`${rejectedCount} 张图片格式不支持或超过 ${this.maxImageSizeMb}MB，已跳过`);
    }

    if (!validImages.length) {
      return;
    }

    let uploadedCount = 0;
    this.isUploadingScreenshots = true;
    this.screenshotUploadStatus = `正在上传 1 / ${validImages.length}`;
    this.progressService.loading();

    from(validImages)
      .pipe(
        concatMap(image => this.uploadScreenshot(image)),
        finalize(() => {
          this.isUploadingScreenshots = false;
          this.screenshotUploadStatus = '';
          this.progressService.complete();
        }),
      )
      .subscribe({
        next: url => {
          uploadedCount += 1;
          this.addUploadedScreenshot(url.url, false);
          this.screenshotUploadStatus = `正在上传 ${Math.min(uploadedCount + 1, validImages.length)} / ${validImages.length}`;
        },
        error: error => this.notificationService.warn(`上传截图失败: ${error.statusMessage ?? '操作失败'}`),
        complete: () => this.notificationService.success(`${uploadedCount} 张截图上传成功`),
      });
  }

  onScreenshotDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isScreenshotDragActive = true;
  }

  onScreenshotDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.isScreenshotDragActive = true;
  }

  onScreenshotDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isScreenshotDragActive = false;
  }

  onScreenshotDrop(event: DragEvent): void {
    event.preventDefault();
    this.isScreenshotDragActive = false;
    this.onUploadScreenshots(event.dataTransfer?.files ?? null);
  }

  setScreenshotAsCover(imageIndex: number): void {
    if (imageIndex <= 0) {
      return;
    }

    const imageUrls = [...this.package.imageUrls];
    const [cover] = imageUrls.splice(imageIndex, 1);
    imageUrls.unshift(cover);
    this.updateScreenshotOrder(imageUrls, '封面已更新');
  }

  moveScreenshot(imageIndex: number, offset: number): void {
    const targetIndex = imageIndex + offset;
    if (targetIndex < 0 || targetIndex >= this.package.imageUrls.length) {
      return;
    }

    const imageUrls = [...this.package.imageUrls];
    [imageUrls[imageIndex], imageUrls[targetIndex]] = [imageUrls[targetIndex], imageUrls[imageIndex]];
    this.updateScreenshotOrder(imageUrls, '截图顺序已更新');
  }

  deleteScreenshot(imageIndex: number): void {
    if (!confirm('确定要删除这张截图吗?')) {
      return;
    }

    const imageUrls = this.package.imageUrls.filter((_, index) => index !== imageIndex);

    this.updatePackage(
      { imageUrls },
      ['image_urls'],
      () => {
        this.package.imageUrls = imageUrls;
        this.buildGalleryImages();
        this.reloadGallery();
        this.notificationService.success('删除成功');
      },
      '删除截图失败',
    );
  }

  screenshotUrl(imageUrl: string): string {
    return getFullUrl(imageUrl);
  }

  trackScreenshot(_index: number, imageUrl: string): string {
    return imageUrl;
  }

  // Child component events and page actions

  onBack(): void {
    this.router.navigate(['categories', getCategoryId(this.package.name).toString()]);
  }

  onChildDownload(_event?: unknown): void {
    this.package.downloadCount = increment(this.package.downloadCount);
  }

  scrollToVersions(): void {
    this.versionsSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  onAuthorNameClick(): void {
    this.router.navigate(['users', this.package.authorId]);
  }

  onToggleCollect(): void {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }

    if (this.isCollected) {
      this.deleteSubscription();
      return;
    }

    this.createSubscription();
  }

  onReport(): void {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
    }
  }

  // Utilities used by the template

  isAdmin(): boolean {
    return isAdmin();
  }

  isAuthor(): boolean {
    return this.package?.authorId === localStorage.getItem('userId');
  }

  getPackageUrl(): string {
    return getPackageUrl(this.package);
  }

  // Page setup

  private initializePage(): void {
    this.resetPageState();
    this.authorZone = this.canManagePackage();
    this.tagCanEdit = this.canManagePackage();

    this.buildGalleryImages();
    this.configDescriptionEditor();
    this.loadAuthor();
    this.loadTags();
    this.loadCollected();
  }

  private resetPageState(): void {
    this.images = [];
    this.allTags = [];
    this.subscription = undefined;
    this.packageNameUpdated = false;
    this.descEditor_updated = false;
    this.descEditor_onFocus = false;
    this.descFolded = true;
    this.descriptionCanExpand = false;
    this.isScreenshotDragActive = false;
    this.isUploadingScreenshots = false;
    this.screenshotUploadStatus = '';
  }

  private buildGalleryImages(): void {
    this.images = this.package.imageUrls.map(imageUrl => this.createGalleryImage(getFullUrl(imageUrl)));
    const defaultScreenshot = getDefaultPackageScreenshot(this.package);
    if (!this.images.length && defaultScreenshot) {
      this.images.push(this.createGalleryImage(getFullUrl(defaultScreenshot)));
    }
  }

  private configDescriptionEditor(): void {
    this.editorService.configEditor(!this.isAuthor(), this.package.name);
  }

  private loadAuthor(): void {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.package.authorId}`,
    })).subscribe({
      next: user => this.author = user,
      error: error => this.notificationService.warn(`无法获取作者信息:${error.statusMessage}`),
    });
  }

  private loadTags(): void {
    const [parent] = parseName(this.package.name);

    this.san11pkService.listTags(new ListTagsRequest({ parent })).subscribe({
      next: resp => this.allTags = resp.tags,
      error: error => this.notificationService.warn(`加载便签失败:${error.statusMessage}`),
    });
  }

  private loadCollected(): void {
    if (!signedIn()) {
      this.subscription = undefined;
      return;
    }

    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: getUserUri(loadUser()),
      filter: `target="${this.package.name}"`,
    })).subscribe({
      next: (resp: ListSubscriptionsResponse) => this.subscription = resp.subscriptions[0],
      error: error => this.notificationService.warn(`载入收藏失败: ${error.statusMessage}`),
    });
  }

  // Persistence helpers

  private updatePackage(
    patch: Partial<Package>,
    paths: string[],
    onSuccess: (updatedPackage: Package) => void,
    errorPrefix: string,
  ): void {
    this.san11pkService.updatePackage(new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        ...patch,
      }),
      updateMask: new FieldMask({ paths }),
    })).subscribe({
      next: onSuccess,
      error: error => this.notificationService.warn(`${errorPrefix}: ${error.statusMessage ?? '操作失败'}`),
    });
  }

  private updateTags(tags: Tag[], successMessage: string, errorPrefix: string): void {
    this.updatePackage(
      { tags },
      ['tags'],
      updatedPackage => {
        this.package.tags = updatedPackage.tags;
        this.notificationService.success(successMessage);
      },
      errorPrefix,
    );
  }

  private deletePackageImmediately(): void {
    this.san11pkService.deletePackage(new DeletePackageRequest({
      name: this.package.name,
    })).subscribe({
      next: () => {
        this.notificationService.success('成功删除');
        this.navigateHomeAndReload();
      },
      error: error => this.notificationService.warn(`删除失败:${error.statusMessage}`),
    });
  }

  private createSubscription(): void {
    this.san11pkService.createSubscription(new CreateSubscriptionRequest({
      parent: getUserUri(loadUser()),
      subscription: new Subscription({
        target: this.package.name,
      }),
    })).subscribe({
      next: (resp: Subscription) => {
        this.subscription = resp;
        this.notificationService.success('收藏成功');
      },
      error: error => this.notificationService.warn(`收藏失败: ${error.statusMessage}`),
    });
  }

  private deleteSubscription(): void {
    this.san11pkService.deleteSubscription(new DeleteSubscriptionRequest({
      name: this.subscription.name,
    })).subscribe({
      next: () => {
        this.subscription = undefined;
        this.notificationService.success('已取消收藏');
      },
      error: error => this.notificationService.warn(`取消收藏失败: ${error.statusMessage}`),
    });
  }

  // Gallery helpers

  private uploadScreenshot(image: File): Observable<{ url: string }> {
    const parent = getPackageUrl(this.package);
    const filename = `${parent}/images/tmp.jpeg`;
    const createImageRequest = new CreateImageRequest({
      parent,
      url: filename,
      imageType: ImageType.SCREENSHOT,
    });

    return this.uploadService.upload(image, GlobalConstants.tmpBucket, filename)
      .pipe(
        filter(upload => upload.state === 'DONE'),
        take(1),
        switchMap(() => this.san11pkService.createImage(createImageRequest)),
      );
  }

  private addUploadedScreenshot(url: string, notify = true): void {
    this.package.imageUrls.push(url);
    this.buildGalleryImages();
    this.reloadGallery();
    if (notify) {
      this.notificationService.success('图片上传成功');
    }
  }

  private createGalleryImage(url: string): ImageItem {
    return new ImageItem({ src: url, thumb: url });
  }

  private reloadGallery(): void {
    this.galleryElementCatched?.load(this.images);
  }

  private updateScreenshotOrder(imageUrls: string[], successMessage: string): void {
    this.updatePackage(
      { imageUrls },
      ['image_urls'],
      () => {
        this.package.imageUrls = imageUrls;
        this.buildGalleryImages();
        this.reloadGallery();
        this.notificationService.success(successMessage);
      },
      '更新截图顺序失败',
    );
  }

  // Description layout helpers

  private scheduleDescriptionOverflowCheck(): void {
    this.clearDescriptionOverflowTimer();
    this.descriptionOverflowTimer = setTimeout(() => this.updateDescriptionOverflow(), 0);
  }

  private clearDescriptionOverflowTimer(): void {
    if (this.descriptionOverflowTimer === undefined) {
      return;
    }

    clearTimeout(this.descriptionOverflowTimer);
    this.descriptionOverflowTimer = undefined;
  }

  private updateDescriptionOverflow(): void {
    if (!this.descriptionElement?.nativeElement || this.descEditor_updated || !this.descFolded || this.descriptionIsEmpty) {
      this.descriptionCanExpand = false;
      return;
    }

    const descriptionContainer = this.descriptionElement.nativeElement;
    this.descriptionCanExpand = descriptionContainer.scrollHeight >
      descriptionContainer.clientHeight + DESCRIPTION_OVERFLOW_TOLERANCE_PX;
    this.cd.detectChanges();
  }

  // Navigation and permission helpers

  canManagePackage(): boolean {
    return this.isAdmin() || this.isAuthor();
  }

  private reloadCurrentPackage(): void {
    this.router.navigate(this.package.name.split('/')).then(() => window.location.reload());
  }

  private navigateHomeAndReload(): void {
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
