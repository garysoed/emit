declare module angular.ui {
  interface IUrlRouterProvider extends angular.IServiceProvider {
    when(whenPath: string, options: any): IUrlRouterProvider;
    otherwise(options: any): IUrlRouterProvider;
  }
}
