import { ACliPage } from './app.po';

describe('vieillitude App', function() {
  let page: ACliPage;

  beforeEach(() => {
    page = new ACliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
