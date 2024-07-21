module.exports = function configJSON(req) {
    return {
      workflowApiVersion: '1.1',
      metaData: {
        // the location of our icon file
        icon: `images/icon.png`,
        category: 'customer'
      },
      type: 'REST',
      lang: {
        'en-US': {
          name: 'Custom Act',
          description: 'First custom act test'
        }
      },
      arguments: {
        execute: {          
          inArguments: [
            {
              discount: 10
            }
          ],
          outArguments: [],
          // Fill in the host with the host that this is running on.
          // It must run under HTTPS
          url: `https://${req.headers.host}/modules/discount-code/execute`,
        }
      },
      configurationArguments: {
        publish: {
          url: `https://${req.headers.host}/modules/discount-code/publish`
        }
      },
      schema: {
        arguments: {
          execute: {
            inArguments: [],
            outArguments: [{
              discountCode: {
                dataType: 'Text',
                direction: 'out',
                access: 'visible'
              },
              discount: {
                dataType: 'Number',
                direction: 'out',
                access: 'visible'
              }
            }]
          }
        }
      }
    };
  };
  