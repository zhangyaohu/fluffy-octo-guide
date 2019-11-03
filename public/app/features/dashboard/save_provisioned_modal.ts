import angular from 'angular';
import { saveAs } from 'file-saver';
import coreModule from 'app/core/core_module';

const template = `
<div class="modal-body">
  <div class="modal-header">
    <h2 class="modal-header-title">
      <i class="fa fa-save"></i><span class="p-l-1">无法保存配置的仪表板</span>
    </h2>

    <a class="modal-header-close" ng-click="ctrl.dismiss();">
      <i class="fa fa-remove"></i>
    </a>
  </div>

  <div class="modal-content">
    <small>
      此仪表板无法从Grafana的UI中保存，因为它已从其他来源进行配置。
      复制JSON或将其保存到下面的文件中。 然后，您可以在相应的配置源中更新仪表板。<br/>
      <i>查看 <a class="external-link" href="http://docs.grafana.org/administration/provisioning/#dashboards" target="_blank">
      文档</a> 获取有关配置的更多信息。</i>
    </small>
    <div class="p-t-2">
      <div class="gf-form">
        <code-editor content="ctrl.dashboardJson" data-mode="json" data-max-lines=15></code-editor>
      </div>
      <div class="gf-form-button-row">
        <button class="btn btn-success" clipboard-button="ctrl.getJsonForClipboard()">
          <i class="fa fa-clipboard"></i> 将JSON复制到剪贴板
        </button>
        <button class="btn btn-secondary" clipboard-button="ctrl.save()">
          <i class="fa fa-save"></i> 将JSON保存到文件
        </button>
        <a class="btn btn-link" ng-click="ctrl.dismiss();">取消</a>
      </div>
    </div>
  </div>
</div>
`;

export class SaveProvisionedDashboardModalCtrl {
  dash: any;
  dashboardJson: string;
  dismiss: () => void;

  /** @ngInject */
  constructor(dashboardSrv) {
    this.dash = dashboardSrv.getCurrent().getSaveModelClone();
    delete this.dash.id;
    this.dashboardJson = angular.toJson(this.dash, true);
  }

  save() {
    var blob = new Blob([angular.toJson(this.dash, true)], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, this.dash.title + '-' + new Date().getTime() + '.json');
  }

  getJsonForClipboard() {
    return this.dashboardJson;
  }
}

export function saveProvisionedDashboardModalDirective() {
  return {
    restrict: 'E',
    template: template,
    controller: SaveProvisionedDashboardModalCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: { dismiss: '&' },
  };
}

coreModule.directive('saveProvisionedDashboardModal', saveProvisionedDashboardModalDirective);
