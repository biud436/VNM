
gs.Component_ImageMap::updateHotspotImage= (hotspot, hovered) ->
    baseImage = if hotspot.enabled then @object.images[2] || @object.images[0] else @object.images[0] 
    temp = hotspot.image
    if hovered and hotspot.enabled
        if hotspot.selected
            hotspot.image = @object.images[4] || @object.images[1] || baseImage
        else
            hotspot.image = @object.images[1] || baseImage
    else
        if hotspot.selected
            hotspot.image = @object.images[3] || baseImage
        else
            hotspot.image = baseImage
            
    if temp != hotspot.image and hovered == yes
        AudioManager.loadSound("cursor").play()         
    
