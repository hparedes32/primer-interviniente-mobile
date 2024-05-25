import React from 'react'
import { View } from 'react-native'

export const Background = () => {
    return (
        <View 
            style={{
                position: 'absolute',
                backgroundColor: 'black',
                top: -300,
                width: 800,
                height: 1100,
                transform: [
                    { rotate: '-75deg' }
                ]
            }}
        />
    )
}
