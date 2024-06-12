import { TestBed } from '@angular/core/testing';

import { ImagenUploadService } from './imagen-upload.service';

describe('ImagenPeliculaService', () => {
  let service: ImagenUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
