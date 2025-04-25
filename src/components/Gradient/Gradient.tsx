'use client'
import style from './Gradient.module.css'
import { default as Gradient } from './Gradient.js'
import { useEffect, useRef } from 'react'

export default function GradientComponent() {
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    useEffect(() => {
        
        // Create your instance
        //@ts-expect-error: Gradient class in js lacks types, too complex to type it
        const gradient = new Gradient()
        
        // Call `initGradient` with the selector to your canvas
        gradient.initGradient('#gradient-canvas') 

    }, [])

    

    return (
        <canvas 
            className={style.gradient} 
            ref={canvasRef}
            id="gradient-canvas" 
            data-transition-in 
        />
    )

}