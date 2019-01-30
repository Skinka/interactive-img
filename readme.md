# jQuery Interactive Image Plugin

## HTML

```html
<div class="interactive" data-ii-width="600" data-ii-height="600" data-ii-src="https://picsum.photos/600/600">
    <div class="interactive-point" data-ii-top="150" data-ii-left="150" data-ii-position="top">
        <div class="interactive-point__point">+</div>
        <div class="interactive-point__description" data-li-position="bottom">
            <p>first text</p>
        </div>
    </div>
</div>
```

## JavaScript

```javascript
$('.interactive').interactiveImg();
```