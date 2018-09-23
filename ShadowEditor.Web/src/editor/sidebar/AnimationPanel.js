import UI from '../../ui/UI';

/**
 * 动画面板
 */
function AnimationPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.uuid = null;
};

AnimationPanel.prototype = Object.create(UI.Control.prototype);
AnimationPanel.prototype.constructor = AnimationPanel;

AnimationPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'Panel',
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '动画'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '名称'
            }, {
                xtype: 'input',
                id: 'name',
                scope: this.id,
                style: {
                    width: '120px'
                },
                onInput: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '类型'
            }, {
                xtype: 'select',
                id: 'type',
                scope: this.id,
                options: {
                    Tween: '补间动画',
                    Skeletal: '骨骼动画',
                    Audio: '播放音乐',
                    Filter: '滤镜动画',
                    Particle: '粒子动画'
                },
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '开始时间'
            }, {
                xtype: 'number',
                id: 'startTime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '结束时间'
            }, {
                xtype: 'number',
                id: 'endTime',
                scope: this.id,
                range: [0, Infinity],
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`showAnimation.${this.id}`, this.showAnimation.bind(this));
};

AnimationPanel.prototype.showAnimation = function (animation) {
    this.uuid = animation.uuid;

    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var startTime = UI.get('startTime', this.id);
    var endTime = UI.get('endTime', this.id);

    name.setValue(animation.name);
    type.setValue(animation.type);
    startTime.setValue(animation.startTime);
    endTime.setValue(animation.endTime);
};

AnimationPanel.prototype.onChange = function () {
    var name = UI.get('name', this.id);
    var type = UI.get('type', this.id);
    var startTime = UI.get('startTime', this.id);
    var endTime = UI.get('endTime', this.id);

    var animation = this.app.editor.animation.getAnimationByUUID(this.uuid);
    animation.name = name.getValue();
    animation.type = type.getValue();
    animation.startTime = startTime.getValue();
    animation.endTime = endTime.getValue();

    this.app.call('animationChanged', this, animation);
};

export default AnimationPanel;