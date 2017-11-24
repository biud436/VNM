# ===================================================================
#
# @name RS_HangulTextInput
# @author biud436
# @help 
# ------------------------------------------------------------------
# LICENCE
# ------------------------------------------------------------------
# This plugin has used the extended library called 'Hangul.js'.
# The Licence of Hangul javascript library that is made by 'Jaemin Jo' is the 'MIT'.
# For more information, please see the link below.
#
# link : https://github.com/e-/Hangul.js
#
# ===================================================================

Imported = Imported || [];
Imported.RS_HangulTextInput = yes

# ====================================================================
# Define the HangulTextHelper class
# ====================================================================

class HangulTextHelper extends Helper

  constructor: ->

  generateTextInputPages: () ->
      pages = []
      defaults = [
          # Page 1-1
          "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",
          # Page 1-2
          "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ",
          # Page 2-1
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          # Page 2-2
          "abcdefghijklmnopqrstuvwxy"
      ]

      charsets = defaults

      for i in [0...charsets.length]
          charsets[i] = charsets[i] ? defaults[i]||""

      for charset in charsets
          pages.push(@generateTextInputPage(charset))

      return pages


# Define global variables
ui.HangulTextHelper = new HangulTextHelper()
$tempHangulPageField = ui.HangulTextHelper?.generateTextInputPages()

# ====================================================================
# Redefine the properties in an ui.InputTextBox
# ====================================================================
ui.UiFactory.customTypes["ui.InputTextBox"] = {
    "type": "ui.FreeLayout",
    "frame": [0, 0, Graphics.width, Graphics.height],
    "controls": [
        {
            "type": "ui.FreeLayout",
            "sizeToFit": true,
            "alignmentX": "center",
            "frame": [0, 10],
            "zIndex": 1000,
            "controls": [
                {
                    "type": "ui.FreeLayout",
                    "sizeToFit": true,
                    "controls": [
                        {
                            "type": "ui.Window",
                            "frame": [0, 0, "MAX($tempFields.letters * 110, 900)", 490],
                            "zIndex": 5
                        },
                        {
                            "type": "ui.Panel",
                            "style": "windowSubPanel",
                            "frame": ["MAX($tempFields.letters * 110, 900) - 130", 180, 130, 470 - 160],
                            "zIndex": 10
                        },
                        {
                            "type": "ui.Panel",
                            "color": [111, 111, 111],
                            "frame": [0, 180, "MAX($tempFields.letters * 110, 900)", 1],
                            "zIndex": 10
                        },
                        {
                            "type": "ui.Text",
                            "styles": ["regularUIText"],
                            "sizeToFit": true,
                            "text": "Text Entry",
                            "zIndex": 10,
                            "frame": [20, 15]
                        },
                        {
                            "type": "ui.StackLayout",
                            "components": [{ "id": "textInput", "type": "Component_TextInput", "params": { "letters": ($ -> $tempFields.letters) } }],
                            "sizeToFit": true,
                            "id": "textField",
                            "zIndex": 10,
                            "alignmentX": "center",
                            "frame": [12, 50],
                            "dataField": $ -> $tempFields.letters
                            "template": {
                                "type": "ui.FreeLayout",
                                "margin": [5, 5, 5, 5],
                                "sizeToFit": true,
                                "controls": [
                                    {
                                        "type": "ui.Image",
                                        "image": "entrybox"
                                    },
                                    {
                                        "type": "ui.Text",
                                        "frame": [0, 0],
                                        "sizeToFit": true,
                                        "alignmentX": "center",
                                        "alignmentY": "center",
                                        "color": [0, 0, 0, 0],
                                        "style": "textInputEntryText",
                                        "text": ""
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "ui.GridLayout",
                    "sizeToFit": true,
                    "id": "charPage1_1",
                    "rows": 6,
                    "order": 10,
                    "columns": 5,
                    "alignmentY": 0,
                    "frame": [30, 185],
                    "cellSpacing": [0, 0, 20, 0],
                    "controls": $ -> $tempHangulPageField[0]
                },
                {
                    "type": "ui.GridLayout",
                    "id": "charPage1_2",
                    "sizeToFit": true,
                    "rows": 6,
                    "columns": 5,
                    "alignmentY": 0,
                    "frame": [420, 185],
                    "cellSpacing": [0, 0, 20, 0],
                    "controls": $ -> $tempHangulPageField[1]
                },
                {
                    "type": "ui.GridLayout",
                    "sizeToFit": true,
                    "id": "charPage2_1",
                    "visible": false,
                    "rows": 6,
                    "order": 10,
                    "columns": 5,
                    "alignmentY": 0,
                    "frame": [30, 185],
                    "cellSpacing": [0, 0, 20, 0],
                    "controls": $ -> $tempHangulPageField[2]
                },
                {
                    "type": "ui.GridLayout",
                    "id": "charPage2_2",
                    "visible": false,
                    "sizeToFit": true,
                    "rows": 6,
                    "columns": 5,
                    "alignmentY": 0,
                    "frame": [420, 185],
                    "cellSpacing": [0, 0, 20, 0],
                    "controls": $ -> $tempHangulPageField[3]
                },
                {
                    "type": "ui.TextBackspace", "params": { "target": ($ -> 'textField.textInput') },
                    "frame": ["100% - 120", 260]
                },
                {
                    "type": "ui.TextAccept",
                    "frame": ["100% - 120", 200]
                },
                {
                    "type": "ui.Text",
                    "sizeToFit": true,
                    "styles": ["regularUIText"],
                    "frame": ["100% - 120", 320],
                    "text": "Page",
                    "zIndex": 5000,
                    "action": {"name": "executeFormulas", "params": [
                        $ -> $charPage1_1.visible = !$charPage1_1.visible
                        $ -> $charPage1_2.visible = !$charPage1_2.visible
                        $ -> $charPage2_1.visible = !$charPage2_1.visible
                        $ -> $charPage2_2.visible = !$charPage2_2.visible
                    ] }
                }
            ]
        }
    ]
}

# ====================================================================
# Composing the character for Hangul
# ====================================================================

rs_alias_Component_TextInput_action_addLetter = gs.Component_TextInput::action_addLetter;
gs.Component_TextInput::action_addLetter = (sender, params) ->
    letter = params.letter
    copyText = Hangul.disassemble(@text[..])

    if @text.length < @letters
        copyText.push(letter)
        @text = Hangul.assemble(copyText)
    else
        @text = @text.replaceAt(@text.length-1, letter.toString())

    @setText(@text.rfill(" ", @letters))
