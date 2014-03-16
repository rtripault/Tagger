var originalGetFields = MODx.panel.Resource.prototype.getFields;
var originalSetup = MODx.panel.Resource.prototype.setup;
var originalBeforeSubmit = MODx.panel.Resource.prototype.beforeSubmit;
Ext.override(MODx.panel.Resource, {
    getFields: function(config) {
        var fields = originalGetFields.call(this, config);

        var tabs = fields.filter(function (row) {
            if(row.id == 'modx-resource-tabs') {
                return row;
            } else {
                return false;
            }
        });

        if (tabs != false && tabs[0]) {
            tabs[0].items.push({
                title: _('tagger')
                ,layout: 'form'
                ,forceLayout: true
                ,deferredRender: false
                ,labelWidth: 200
                ,bodyCssClass: 'main-wrapper'
                ,autoHeight: true
                ,defaults: {
                    border: false
                    ,msgTarget: 'under'
                }
                ,items: this.taggerGetFields(config)
            });
        }

        return fields;
    }

    ,setup: function() {
        if (!this.initialized) {
            this.getForm().setValues(Tagger.tags);
        }

        originalSetup.call(this);
    }

    ,beforeSubmit: function(o) {
        var tagFields = this.find('xtype', 'tagger-field-tags')

        Ext.each(tagFields, function(tagField) {
            tagField.addItemsFromField();
        });

        originalBeforeSubmit.call(this, o);
    }

    ,taggerGetFields: function(config) {
        var fields = [];

        Ext.each(Tagger.groups, function(group) {
           fields.push({
               xtype: group.field_type
               ,fieldLabel: group.name
               ,name: 'tagger-' + group.id
               ,hiddenName: 'tagger-' + group.id
               ,displayField: 'tag'
               ,valueField: 'tag'
               ,fields: ['tag']
               ,url: Tagger.config.connectorUrl
               ,allowAdd: group.allow_new
               ,allowBlank: group.allow_blank
               ,pageSize: 0
               ,baseParams: {
                   action: 'mgr/extra/gettags'
                   ,group: group.id
               }
           });
        });

        return fields;
    }
});