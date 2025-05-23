export default {
  "dataSchema": {
    "type": "object",
    "properties": {
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "refs": {
    "item-*": {
      "eventListeners": {
        "mousedown": {
          "required": true,
          "handler": "handleItemMouseDown"
        }
      }
    }
  },
  "template": [
    {
      "rtgl-view w=f h=100vh p=m w=200": [
        {
          "rtgl-view w=f h=f g=s": [
            {
              "rtgl-text": "File Explorer"
            },
            {
              "rtgl-view#container w=f h=f style=\"position: relative;\"": [
                {
                  "$map": {
                    "$eval": "items"
                  },
                  "each(v,k)": [
                    {
                      "rtgl-view#item-${v.id} w=f h=f p=m h=32 w=f cur=p av=c": [
                        {
                          "rtgl-text s=sm style=\"padding-left: ${v.level * 16}px;\"": "${v.name}"
                        }
                      ]
                    }
                  ]
                },
                {
                  "$switch": {
                    "targetDragIndex != -2": [
                      {
                        "rtgl-view pos=abs w=200 bgc=ac h=2 style=\"top: ${32 * (targetDragIndex + 1)}px\"": null
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};