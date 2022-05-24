const fs = require("fs-extra");
const path = require("path");
const { argv } = require('yargs');

async function go() {
  for (let mode of ["classic", 'modern']) {
    let configFile = path.resolve(`component_config.json`);
    let config = JSON.parse(
      fs.readFileSync(configFile, 'utf8')
    );

    for (let component of (mode === 'classic' ? config.classicComponents : config.modernComponents)) {
      setData(component, mode);
    }
  }
}

go()

function setData(component, toolkit) {
  let data = require(
    path.join(
      path.resolve(),
      'data',
      toolkit,
      `${toolkit}-all-classes-flatten.json`
    )
  );

  for (i = 0; i < data.global.items.length; i++) {
    doLaunch(data.global.items[i], i, component, toolkit);
  }
}

function doLaunch(item, i, component, toolkit) {
  //let processIt = shouldProcessIt(item, toolkit)
  let processIt = true;

  if (processIt == true) {
    switch(item.$type) {
      case 'property':
        break;

      case 'class':
        if (item.alias != undefined) {
          let doIt = 'no';
          let aliasArray = item.alias.split(',');

          if (aliasArray.length === 2) {
            if (aliasArray[0].substring(0, 6) === 'widget') {
              if (aliasArray[0].slice(7) === component) {
                doIt = 'yes';
              }

              if (aliasArray[1].substring(0, 6) === 'widget') {
                if (aliasArray[1].slice(7) === component) {
                  doIt = 'yes';
                }
              }
            }
          } else {
            if (aliasArray[0].substring(0, 6) === 'widget') {
              if (aliasArray[0].slice(7) === component) {
                doIt = 'yes';
              }
            }
          }

          if (doIt === 'yes') {
              //console.log(item.items)
              //configs
              //events
              //methods
              //sass-mixins
              //static-methods
              //static-properties
              //vars

              let configsArray = []
              const foundConfigs = item.items.find(element => element.$type === 'configs');
              let configs = foundConfigs.items;

              for (i = 0; i < configs.length; i++) {
                let config = configs[i];
                let o = {};
                o.name = config.name;
                //o.text = config.text;
                o.type = config.type;
                o.defaultValue = config.value;
                o.description = config.text;
                configsArray.push(o);
              }

              let methodsArray = []
              const foundMethods = item.items.find(element => element.$type === 'methods');
              let methods = foundMethods.items;

              for (i = 0; i < methods.length; i++) {
                let method = methods[i]
                let o = {}
                o.name = method.name;
                //o.text = method.text;
                let methodParamsArray = [];

                if (method.items !== undefined) {
                  for (j = 0; j < method.items.length; j++) {
                    let param = method.items[j];
                    let p = {};

                    if (param.$type === 'return') {
                      o.returnType = p.type;
                    }

                    if (param.$type === 'param') {                      
                      p.name = param.name;
                      p.type = param.type;
                      p.description = param.text;
                      methodParamsArray.push(p);
                    }
                  }

                  o.params = methodParamsArray;
                } else {
                  //o.params = []
                }

                methodsArray.push(o)
              }

              let eventsArray = []
              const foundEvents = item.items.find(element => element.$type === 'events');
              let events = foundEvents.items;

              for (i = 0; i < events.length; i++) {
                let event = events[i]
                let o = {}
                o.name = event.name;
                //o.text = event.text;
                let eventParamsArray = []

                if (event.items !== undefined) {
                  for (j = 0; j < event.items.length; j++) {
                    let param = event.items[j];
                    let p = {};

                    if (param.$type === 'return') {
                      o.returnType = p.type;
                    }

                    if (param.$type === 'param') {
                      p.name = param.name;
                      p.type = param.type;
                      p.description = param.text;
                      eventParamsArray.push(p);
                    }
                  }

                  o.params = eventParamsArray;
                } else {
                  //o.params = []
                }

                eventsArray.push(o)
              }


            let primaryCollection = 'na'
            let primaryCollectionBaseType = 'na'

            if (component === 'grid') {
              primaryCollection = 'columns'
              primaryCollectionBaseType = 'Ext.grid.column.Column'
            }

            if (component === 'panel') {
              primaryCollection = 'items'
              primaryCollectionBaseType = 'Ext.Component'
            }

            let v = {
              "xtype":component, //item.alias.slice(7),
              "name":item.name,
              "extends":item.extends,
              "extended":item.extended,
              "primaryCollection":primaryCollection,
              "primaryCollectionBaseType":primaryCollectionBaseType,
              "numConfigs": configsArray.length,
              "numMethods": methodsArray.length,
              "numEvents": eventsArray.length,
              "configs":configsArray,
              "methods":methodsArray,
              "events":eventsArray
            }

            let componentPath = path.join(
              argv?.output ?? path.resolve(),
              'ext-' + (argv.sdk_version ?? '7.5.0'),
              toolkit
            );

            if (!fs.existsSync(componentPath)){
              fs.mkdirSync(componentPath, { recursive: true });
            }

            fs.writeFileSync(
              path.join(
                componentPath,
                component + '.json'
              ),
              JSON.stringify(v,null,2)
            );
          } else {
            //console.log(aliasArray)
          }
        }
        break;

      case 'method':
        break;

      case 'enum':
        break;

      default:
        console.log('default: ' + item.$type)
    }
  }
}

function shouldProcessIt(o, toolkit) {
  let processIt = false;

  if (toolkit == 'classic') {
    let item = o

    if (item.alias != undefined) {
      if (item.alias.substring(0, 6) == 'widget') {
        processIt = true;
      }
    }

    if (o.extended != undefined) {
      if ( o.extended.includes("Ext.Base")) {
        processIt = true
      }
    }

    if (o.name == 'Ext.Widget') {
      processIt = true
    }

    if (o.name == 'Ext.Evented') {
        processIt = true
    }

    if (o.name == 'Ext.Base') {
        processIt = true
    }

    // if (o.name == 'Ext.grid.column.Column') {
    //   processIt = false
    // }

    let aliases = []
    item.xtypes = []

    if (item.alias != undefined) {
      aliases = item.alias.split(",")

      for (alias = 0; alias < aliases.length; alias++) {
        if (aliases[alias].substring(0, 6) == 'widget') {
          let xtypelocal = aliases[alias].substring(7)
          item.xtypes.push(xtypelocal)
        }
      }
    }

    // if (processIt == true) {
    //   console.log(item.alias)
    // }

    return processIt
  }

  if (toolkit == 'modern') {
    if (o.extended == undefined) {
      processIt = false;
    } else {
        let n = o.extended.indexOf("Ext.Widget");

        if (n != -1) {
            processIt = true;
        } else {
            processIt = false;
        }
    }

    if (o.name == 'Ext.Widget') {
        processIt = true
    }

    if (o.name == 'Ext.Evented') {
        processIt = true
    }

    if (o.name == 'Ext.Base') {
        processIt = true
    }

    if (o.items == undefined) {
        processIt = false
    }

    return processIt
  }



  // if (toolkit == 'modern') {

  //   // let localxtypes = [];
  //   // if (o.alias != undefined) {
  //   //   //if (item.alias.substring(0, 6) == 'widget') {
  //   //     let aliases = o.alias.split(",")
  //   //     for (alias = 0; alias < aliases.length; alias++) {
  //   //       if (aliases[alias].substring(0, 6) == 'widget') {
  //   //         let xtypelocal = aliases[alias].substring(7)
  //   //         localxtypes.push(xtypelocal)
  //   //       }
  //   //     //}
  //   //   }
  //   // }

  //   // if (localxtypes.length == 0) {
  //   //   processIt = false;
  //   //   return processIt;
  //   // }






  //   if (o.alias == undefined) {
  //     processIt = false;
  //   }

  //   else if (o.extended == undefined) {
  //     processIt = false;
  //   }
  //   else {
  //       let n = o.extended.indexOf("Ext.Widget");
  //       if (n != -1) {
  //           processIt = true;
  //       }
  //       else {
  //           processIt = false;
  //       }
  //   }
  //   if (o.name == 'Ext.Widget') {
  //       processIt = true
  //   }
  //   if (o.name == 'Ext.Evented') {
  //       processIt = true
  //   }
  //   if (o.name == 'Ext.Base') {
  //       processIt = true
  //   }
  //   if (o.items == undefined) {
  //       processIt = false
  //   }
  //   return processIt
  // }
}
