class waveEffect extends gs.GraphicEffect

    constructor: (data) ->
        super(data)
        @type = gs.GraphicEffectType.BASE
        @name = "waveEffect"

    setup: (effect, task, texture) ->
        effect.setVector2Value("TextureMax", Graphics.width / texture.realWidth, Graphics.height / texture.realHeight)
        effect.setFloatValue("waveHeight", (Graphics.height / texture.realHeight) * 0.5)
        effect.setFloatValue("waveFrequency", 0.02)
        effect.setFloatValue("waveTime", Graphics.frameCount / 50)
        effect.setFloatValue("wavePhase", 6.283185307179586)
        effect.setFloatValue("UVSpeed", 0.25)

    @register: ->
        # This is an example of how to register your own custom shader-based effect.
        gs.Effect.registerEffect(new gs.EffectInfo({
            # Use BASE if the effect overwrites gl_FragColor. Use ADDON if the effect uses gl_FragColor as input.
            type: gs.GraphicEffectType.BASE,
            # The name-property needs to match the value of the name-property of the effect-class.
            name: "waveEffect",
            # preprocessor defines, this not used in most cases except for internal effects.
            defines: [""],
            # A list of all uniforms with correct syntax.
            uniforms: ["uniform sampler2D Texture0;",
            "uniform vec2 TextureMax;",
            "uniform float waveHeight;",
            "uniform float waveFrequency;",
            "uniform float waveTime;",
            "uniform float wavePhase;",
            "uniform float UVSpeed;"],
            # A list of all varyings with correct syntax
            varying: ["varying vec2 textureCoord;", "varying vec4 vColor;"],
            # A list of all functions calls with correct syntax.
            functionCalls: ["wave_effect();"],
            # A list of all functions with correct syntax.
            functions: ["""
                void wave_effect()
                {
                    vec2 uv = textureCoord;
                    float time = waveFrequency * sin(wavePhase * (mod(waveTime - uv.y, waveHeight)));
                    vec2 vCoord = vec2(uv.x + time * UVSpeed, uv.y);

                    gl_FragColor = texture2D(Texture0, max(mod(vCoord, TextureMax), 0.0));
                    gl_FragColor[3] *= vColor[3];
                }
            """]
        }))

gs.waveEffect = waveEffect

class WaveEffectCollection extends gs.EffectCollection

    constructor: ->
        @waveEffect = new gs.waveEffect()

        super

gs.EffectCollection = WaveEffectCollection
