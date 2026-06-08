import {
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
import { InteractionService } from '../../common/interaction.service';
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
export class PackageDetailComponent implements OnInit, OnDestroy {
  @ViewChild('gallery') galleryElementCatched;
  @ViewChild('descriptionContainer') descriptionElement: ElementRef<HTMLElement>;
  @ViewChild('descriptionSection') descriptionSection: ElementRef<HTMLElement>;
  @ViewChild('discussionSection') discussionSection: ElementRef<HTMLElement>;
  @ViewChild('screenshotsSection') screenshotsSection: ElementRef<HTMLElement>;
  @ViewChild('versionsSection') versionsSection: ElementRef<HTMLElement>;

  images: ImageItem[] = [];
  package: Package;
  author: User = new User({});

  packageNameDraft = '';
  descEditor_updated = false;
  descriptionEditing = false;
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
  private discussionScrollTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private interactionService: InteractionService,
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

    this.route.fragment
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fragment => {
        if (fragment === 'discussion') {
          this.scheduleDiscussionScroll();
        }
      });
  }

  ngOnDestroy(): void {
    this.clearDescriptionOverflowTimer();
    clearTimeout(this.discussionScrollTimer);
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

  get packageNameChanged(): boolean {
    return this.packageNameDraft.trim() !== this.package.packageName;
  }

  get categoryId(): number {
    return getCategoryId(this.package.name);
  }

  get categoryName(): string {
    return GlobalConstants.categories.find(category => Number(category.value) === this.categoryId)?.text ?? '资源分类';
  }

  get resourceStatus(): { label: string; description: string; icon: string; tone: string } {
    switch (this.package.state) {
      case ResourceState.NORMAL:
        return {
          label: '正常展示',
          description: '资源已公开，访客可以浏览和下载。',
          icon: 'check_circle',
          tone: 'normal',
        };
      case ResourceState.UNDER_REVIEW:
        return {
          label: '待审核',
          description: '资源正在等待管理员审核，暂未公开展示。',
          icon: 'pending_actions',
          tone: 'review',
        };
      case ResourceState.HIDDEN:
        return {
          label: '已隐藏',
          description: '资源已停止公开展示，作者与管理员仍可访问。',
          icon: 'visibility_off',
          tone: 'hidden',
        };
      case ResourceState.SCHEDULED_DELETE:
        return {
          label: '待删除',
          description: '作者已申请删除，等待系统或管理员处理。',
          icon: 'schedule',
          tone: 'danger',
        };
      case ResourceState.DELETED:
        return {
          label: '已删除',
          description: '资源已被删除，不再对访客开放。',
          icon: 'delete',
          tone: 'danger',
        };
      default:
        return {
          label: '状态未知',
          description: '当前资源状态无法识别，请联系管理员检查。',
          icon: 'help_outline',
          tone: 'unknown',
        };
    }
  }

  get availableTags(): Tag[] {
    return this.allTags.filter(tag => !this.package.tags.some(selected => selected.name === tag.name));
  }

  get maintenanceItems(): { icon: string; text: string; done: boolean }[] {
    return [
      {
        icon: 'image',
        text: '截图和封面',
        done: (this.package?.imageUrls?.length || 0) > 0,
      },
      {
        icon: 'description',
        text: '资源介绍',
        done: this.descriptionText.length >= 80,
      },
      {
        icon: 'sell',
        text: '标签',
        done: (this.package?.tags?.length || 0) > 0,
      },
    ];
  }

  get maintenanceCompleteCount(): number {
    return this.maintenanceItems.filter(item => item.done).length;
  }

  get maintenanceHealthText(): string {
    if (this.maintenanceCompleteCount === this.maintenanceItems.length) {
      return '资料完整';
    }

    return `${this.maintenanceCompleteCount}/${this.maintenanceItems.length} 项完成`;
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
    const updatedPackageName = this.packageNameDraft.trim();
    if (!updatedPackageName) {
      return;
    }

    this.updatePackage(
      { packageName: updatedPackageName },
      ['package_name'],
      () => {
        this.package.packageName = updatedPackageName;
        this.packageNameDraft = updatedPackageName;
        this.notificationService.success('更新成功');
      },
      '更新失败',
    );
  }

  cancelPackageNameEdit(): void {
    this.packageNameDraft = this.package.packageName;
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
    if (!this.isAuthor() || !this.descriptionEditing) {
      return;
    }

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
        this.descriptionEditing = false;
        this.editorService.setDisabled(true);
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

  startDescriptionEdit(): void {
    if (!this.isAuthor()) {
      return;
    }

    this.descriptionEditing = true;
    this.descFolded = false;
    this.editorService.setDisabled(false);
    this.cd.detectChanges();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.editorService.focus();
      this.scrollToDescriptionEditor();
    }));
  }

  cancelDescriptionEdit(): void {
    this.descriptionEditing = false;
    this.descEditor_updated = false;
    this.editorService.setDisabled(true);
    this.editorService.setData(this.package.description);
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

    this.interactionService.confirm({
      title: `${actionText}资源`,
      message: `确认要${actionText}“${this.package.packageName}”吗？`,
      confirmText: actionText,
      danger: nextState === ResourceState.HIDDEN,
    }).subscribe(confirmed => confirmed && this.updatePackage(
      { state: nextState },
      ['state'],
      () => {
        this.notificationService.success('操作成功');
        this.reloadCurrentPackage();
      },
      '操作失败',
    ));
  }

  onDelete(): void {
    if (!this.isAdmin()) {
      return;
    }

    this.interactionService.confirm({
      title: '永久删除资源',
      message: `确认要永久删除“${this.package.packageName}”吗？所有版本和讨论都将被删除，此操作不可撤销。`,
      confirmText: '永久删除',
      danger: true,
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.deletePackageImmediately();
    });
  }

  onRequestDelete(): void {
    if (!this.isAuthor()) {
      return;
    }

    this.interactionService.confirm({
      title: '删除资源',
      message: `确认要删除“${this.package.packageName}”吗？资源将进入计划删除状态。`,
      confirmText: '删除资源',
      danger: true,
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.updatePackage(
      { state: ResourceState.SCHEDULED_DELETE },
      ['state'],
      () => {
        this.notificationService.success('成功删除');
        this.navigateHomeAndReload();
      },
      '删除失败',
      );
    });
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
    this.interactionService.confirm({
      title: '删除截图',
      message: imageIndex === 0 ? '这是当前封面。删除后下一张截图将成为封面。' : '确定要删除这张截图吗？',
      confirmText: '删除截图',
      danger: true,
    }).subscribe(confirmed => {
      if (!confirmed) return;
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
    });
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

  scrollToScreenshots(): void {
    this.screenshotsSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private scheduleDiscussionScroll(): void {
    clearTimeout(this.discussionScrollTimer);
    this.discussionScrollTimer = setTimeout(() => {
      this.scrollToDiscussion('smooth');
      this.discussionScrollTimer = setTimeout(() => this.scrollToDiscussion('auto'), 1200);
    }, 500);
  }

  private scrollToDiscussion(behavior: ScrollBehavior): void {
    this.discussionSection?.nativeElement.scrollIntoView({
      behavior,
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
    this.tagCanEdit = this.isAuthor();

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
    this.packageNameDraft = this.package.packageName;
    this.descEditor_updated = false;
    this.descriptionEditing = false;
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
    this.editorService.configEditor(true, this.package.name);
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
        this.interactionService.undo('已取消收藏').subscribe(() => {
          this.createSubscription();
        });
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

  private scrollToDescriptionEditor(): void {
    const descriptionSection = this.descriptionSection?.nativeElement;
    if (!descriptionSection) {
      return;
    }

    const headerOffset = 80;
    const targetTop = window.scrollY + descriptionSection.getBoundingClientRect().top - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }

  private reloadCurrentPackage(): void {
    this.router.navigate(this.package.name.split('/')).then(() => window.location.reload());
  }

  private navigateHomeAndReload(): void {
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
