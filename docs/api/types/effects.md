# Effects Types Reference

This document details the TypeScript type definitions for QCObjects effects and animations.

## Core Types

### EffectConfig
Basic configuration for effects.
```typescript
interface EffectConfig {
  duration?: number;
  timing?: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}
```

### KeyframeConfig
Configuration for animation keyframes.
```typescript
interface KeyframeConfig {
  [key: string]: string | number | null;
}
```

### AnimationTimeline
Timeline configuration for complex animations.
```typescript
interface AnimationTimeline {
  startTime?: number;
  currentTime?: number;
  playbackRate: number;
  duration: number;
}
```

## Effect Types

### FadeConfig
Configuration for fade effects.
```typescript
interface FadeConfig extends EffectConfig {
  type: 'in' | 'out';
  targetOpacity?: number;
  initialOpacity?: number;
}
```

### SlideConfig
Configuration for slide effects.
```typescript
interface SlideConfig extends EffectConfig {
  direction: 'up' | 'down' | 'left' | 'right';
  distance?: string;
  easing?: string;
}
```

### TransformConfig
Configuration for transform effects.
```typescript
interface TransformConfig extends EffectConfig {
  scale?: number;
  rotate?: number;
  translate?: {
    x?: string;
    y?: string;
    z?: string;
  };
  skew?: {
    x?: number;
    y?: number;
  };
}
```

## Animation Types

### AnimationState
State of an animation.
```typescript
type AnimationState = 'idle' | 'running' | 'paused' | 'finished';
```

### AnimationEventMap
Events emitted during animation.
```typescript
interface AnimationEventMap {
  'animation-start': CustomEvent<void>;
  'animation-end': CustomEvent<void>;
  'animation-cancel': CustomEvent<void>;
  'animation-iteration': CustomEvent<number>;
}
```

### AnimationController
Controller for managing animations.
```typescript
interface AnimationController {
  play(): void;
  pause(): void;
  cancel(): void;
  finish(): void;
  reverse(): void;
  updatePlaybackRate(rate: number): void;
  getState(): AnimationState;
}
```

## Usage Examples

### Basic Fade Effect
```typescript
class FadeEffect implements AnimationController {
  private element: QCElement;
  private config: FadeConfig;
  private animation: Animation;
  
  constructor(element: QCElement, config: FadeConfig) {
    this.element = element;
    this.config = {
      duration: 300,
      timing: 'ease',
      ...config
    };
    
    const keyframes = this.createKeyframes();
    this.animation = element.animate(keyframes, this.config);
  }
  
  private createKeyframes(): Keyframe[] {
    const { type, initialOpacity = 0, targetOpacity = 1 } = this.config;
    return type === 'in' ? [
      { opacity: initialOpacity },
      { opacity: targetOpacity }
    ] : [
      { opacity: targetOpacity },
      { opacity: initialOpacity }
    ];
  }
  
  play(): void {
    this.animation.play();
  }
  
  pause(): void {
    this.animation.pause();
  }
  
  cancel(): void {
    this.animation.cancel();
  }
  
  finish(): void {
    this.animation.finish();
  }
  
  reverse(): void {
    this.animation.reverse();
  }
  
  updatePlaybackRate(rate: number): void {
    this.animation.playbackRate = rate;
  }
  
  getState(): AnimationState {
    return this.animation.playState as AnimationState;
  }
}
```

### Transform Animation
```typescript
class TransformEffect implements AnimationController {
  private element: QCElement;
  private config: TransformConfig;
  private animation: Animation;
  
  constructor(element: QCElement, config: TransformConfig) {
    this.element = element;
    this.config = {
      duration: 500,
      timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ...config
    };
    
    const keyframes = this.createKeyframes();
    this.animation = element.animate(keyframes, this.config);
  }
  
  private createKeyframes(): Keyframe[] {
    const { scale = 1, rotate = 0, translate, skew } = this.config;
    
    return [
      { transform: 'none' },
      {
        transform: [
          `scale(${scale})`,
          `rotate(${rotate}deg)`,
          translate && `translate3d(${translate.x || 0}, ${translate.y || 0}, ${translate.z || 0})`,
          skew && `skew(${skew.x || 0}deg, ${skew.y || 0}deg)`
        ].filter(Boolean).join(' ')
      }
    ];
  }
  
  // ... implement AnimationController methods
}
```

## Type Guards

### isAnimationController
Check if an object implements AnimationController.
```typescript
function isAnimationController(obj: unknown): obj is AnimationController {
  return typeof obj === 'object' &&
         obj !== null &&
         'play' in obj &&
         'pause' in obj &&
         'cancel' in obj &&
         'finish' in obj;
}
```

### isFadeConfig
Check if an object is a FadeConfig.
```typescript
function isFadeConfig(obj: unknown): obj is FadeConfig {
  return typeof obj === 'object' &&
         obj !== null &&
         'type' in obj &&
         (obj.type === 'in' || obj.type === 'out');
}
```

## Best Practices

### 1. Composable Effects
```typescript
class CompositeEffect implements AnimationController {
  private effects: AnimationController[];
  
  constructor(effects: AnimationController[]) {
    this.effects = effects;
  }
  
  play(): void {
    this.effects.forEach(effect => effect.play());
  }
  
  pause(): void {
    this.effects.forEach(effect => effect.pause());
  }
  
  cancel(): void {
    this.effects.forEach(effect => effect.cancel());
  }
  
  finish(): void {
    this.effects.forEach(effect => effect.finish());
  }
  
  reverse(): void {
    this.effects.forEach(effect => effect.reverse());
  }
  
  updatePlaybackRate(rate: number): void {
    this.effects.forEach(effect => effect.updatePlaybackRate(rate));
  }
  
  getState(): AnimationState {
    const states = new Set(this.effects.map(effect => effect.getState()));
    return states.size === 1 ? states.values().next().value : 'idle';
  }
}
```

### 2. Effect Factory
```typescript
class EffectFactory {
  static createFade(element: QCElement, config: FadeConfig): AnimationController {
    return new FadeEffect(element, config);
  }
  
  static createSlide(element: QCElement, config: SlideConfig): AnimationController {
    // Implement slide effect
    return new SlideEffect(element, config);
  }
  
  static createTransform(element: QCElement, config: TransformConfig): AnimationController {
    return new TransformEffect(element, config);
  }
  
  static createComposite(effects: AnimationController[]): AnimationController {
    return new CompositeEffect(effects);
  }
}
```

### 3. Performance Optimization
```typescript
class OptimizedEffect implements AnimationController {
  private animation: Animation;
  private rafId?: number;
  
  constructor(element: QCElement, keyframes: Keyframe[], config: EffectConfig) {
    this.animation = element.animate(keyframes, {
      ...config,
      composite: 'accumulate',
      will-change: 'transform, opacity'
    });
    
    // Use requestAnimationFrame for smooth animations
    this.animation.onfinish = () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    };
  }
  
  play(): void {
    const animate = () => {
      if (this.animation.playState === 'running') {
        this.rafId = requestAnimationFrame(animate);
      }
    };
    
    this.animation.play();
    this.rafId = requestAnimationFrame(animate);
  }
  
  // ... implement other AnimationController methods
}
```

## Related Topics

- [Component Types](component.md)
- [DOM Types](dom.md)
- [Examples](../../examples/README.md) 