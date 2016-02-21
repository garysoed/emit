import { NavigateService } from './navigate-service';
import ViewType from './view-type';


describe('navigate.NavigateService', () => {
  let mock$location;
  let service;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path']);

    service = new NavigateService(mock$location);
  });

  describe('get currentView', () => {
    it('should return the correct view type', () => {
      let view = ViewType.ABOUT;
      let path = `/about`;

      mock$location.path.and.returnValue(path);

      expect(service.currentView).toEqual(view);
      expect(mock$location.path).toHaveBeenCalledWith();
    });
  });

  describe('getPathForView', () => {
    it('should return the correct path', () => {
      expect(service.getPathForView(ViewType.ABOUT)).toEqual('about');
    });
  });

  describe('to', () => {
    it('should navigate to the specified view', () => {
      let view = ViewType.ABOUT;

      service.to(view);

      expect(mock$location.path).toHaveBeenCalledWith(`about`);
    });
  });
});
