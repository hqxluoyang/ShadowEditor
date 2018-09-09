import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 阴影组件
 * @param {*} options 
 */
function ShadowComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

ShadowComponent.prototype = Object.create(BaseComponent.prototype);
ShadowComponent.prototype.constructor = ShadowComponent;

ShadowComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'shadowPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: 0,
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '阴影组件'
            }]
        }, {
            xtype: 'row',
            id: 'objectShadowRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '阴影'
            }, {
                xtype: 'boolean',
                id: 'objectCastShadow',
                scope: this.id,
                value: false,
                text: '产生',
                onChange: this.onChangeCastShadow.bind(this)
            }, {
                xtype: 'boolean',
                id: 'objectReceiveShadow',
                scope: this.id,
                value: false,
                text: '接收',
                onChange: this.onChangeReceiveShadow.bind(this)
            }]
        }, {
            xtype: 'row',
            id: 'objectShadowRadiusRow',
            scope: this.id,
            children: [{
                xtype: 'label',
                text: '半径'
            }, {
                xtype: 'number',
                id: 'objectShadowRadius',
                scope: this.id,
                value: 1,
                onChange: this.onChangeShadowRadius.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ShadowComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ShadowComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ShadowComponent.prototype.updateUI = function () {
    var container = UI.get('shadowPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && (editor.selected instanceof THREE.Mesh || editor.selected instanceof THREE.DirectionalLight || editor.selected instanceof THREE.PointLight || editor.selected instanceof THREE.SpotLight)) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var objectShadowRadiusRow = UI.get('objectShadowRadiusRow', this.id);

    var objectCastShadow = UI.get('objectCastShadow', this.id);
    var objectReceiveShadow = UI.get('objectReceiveShadow', this.id);
    var objectShadowRadius = UI.get('objectShadowRadius', this.id);

    objectCastShadow.setValue(this.selected.castShadow);

    if (this.selected instanceof THREE.Light) {
        objectReceiveShadow.dom.style.display = 'none';
        objectShadowRadiusRow.dom.style.display = '';
        objectShadowRadius.setValue(this.selected.shadow.radius);
    } else {
        objectReceiveShadow.dom.style.display = '';
        objectShadowRadiusRow.dom.style.display = 'none';
        objectReceiveShadow.setValue(this.selected.receiveShadow);
    }
};

ShadowComponent.prototype.onChangeCastShadow = function () {
    var objectCastShadow = UI.get('objectCastShadow', this.id);
    this.selected.castShadow = objectCastShadow.getValue();
    if (this.selected instanceof THREE.Mesh) {
        this.updateMaterial(this.selected.material);
    }
};

ShadowComponent.prototype.onChangeReceiveShadow = function () {
    var objectReceiveShadow = UI.get('objectReceiveShadow', this.id);
    this.selected.receiveShadow = objectReceiveShadow.getValue();
    if (this.selected instanceof THREE.Mesh) {
        this.updateMaterial(this.selected.material);
    }
};

ShadowComponent.prototype.onChangeShadowRadius = function () {
    var objectShadowRadius = UI.get('objectShadowRadius', this.id);
    this.selected.shadow.radius = objectShadowRadius.getValue();
};

ShadowComponent.prototype.updateMaterial = function (material) {
    if (Array.isArray(material)) {
        material.forEach(n => {
            n.needsUpdate = true;
        });
    } else {
        material.needsUpdate = true;
    }
};

export default ShadowComponent;