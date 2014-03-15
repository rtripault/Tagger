Tagger.grid.Group = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'tagger-grid-group'
        ,url: Tagger.config.connectorUrl
        ,baseParams: {
            action: 'mgr/group/getlist'
        }
        ,save_action: 'mgr/group/updatefromgrid'
        ,autosave: true
        ,fields: ['id','name']
        ,autoHeight: true
        ,paging: true
        ,remoteSort: true
        ,enableDragDrop: true
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,width: 70
            ,sortable: true
        },{
            header: _('tagger.group.name')
            ,dataIndex: 'name'
            ,width: 200
            ,sortable: true
            ,editor: { xtype: 'textfield' }
        }]
        ,tbar: [{
            text: _('tagger.group.create')
            ,handler: this.createGroup
            ,scope: this
        },'->',{
            xtype: 'textfield'
            ,emptyText: _('tagger.global.search') + '...'
            ,listeners: {
                'change': {fn:this.search,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this);
                            this.blur();
                            return true;
                        }
                        ,scope: cmp
                    });
                },scope:this}
            }
        }]
    });
    Tagger.grid.Group.superclass.constructor.call(this,config);
};
Ext.extend(Tagger.grid.Group,MODx.grid.Grid,{
    windows: {}

    ,getMenu: function() {
        var m = [];
        m.push({
            text: _('tagger.group.update')
            ,handler: this.updateGroup
        });
        m.push('-');
        m.push({
            text: _('tagger.group.remove')
            ,handler: this.removeGroup
        });
        this.addContextMenuItem(m);
    }
    
    ,createGroup: function(btn,e) {
        var createGroup = MODx.load({
            xtype: 'tagger-window-group'
            ,title: _('tagger.group.create')
            ,listeners: {
                'success': {fn:function() { this.refresh(); },scope:this}
            }
        });

        createGroup.fp.getForm().reset();
        createGroup.show(e.target);
    }

    ,updateGroup: function(btn,e) {

        var updateGroup = MODx.load({
            xtype: 'tagger-window-group'
            ,title: _('tagger.group.update')
            ,action: 'mgr/group/update'
            ,record: this.menu.record
            ,listeners: {
                'success': {fn:function() { this.refresh(); },scope:this}
            }
        });

        updateGroup.fp.getForm().reset();
        updateGroup.fp.getForm().setValues(this.menu.record);
        updateGroup.show(e.target);
    }
    
    ,removeGroup: function(btn,e) {
        if (!this.menu.record) return false;
        
        MODx.msg.confirm({
            title: _('tagger.group.remove')
            ,text: _('tagger.group.remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'mgr/group/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success': {fn:function(r) { this.refresh(); },scope:this}
            }
        });
    }

    ,search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
});
Ext.reg('tagger-grid-group',Tagger.grid.Group);


