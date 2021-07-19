import { TestBed } from '@angular/core/testing';

import { ArticleResolverService } from './article-resolver.service';

describe('ArticleResolverService', () => {
  let service: ArticleResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
