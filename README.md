# NUXT JSS
Nuxt JSS is an implementation of the CSS in JS more specifically [JSS](https://cssinjs.org/). 

## How to use: 
In some top level component you need to wrap a theme provider 

>layouts/default.vue
```
<template>
  <div>
    <ThemeProvider>
      <nuxt />
    </ThemeProvider>
  </div>
</template>
<script >

import { ThemeProvider } from 'nuxt-jss'
export default {
  components: { ThemeProvider }
}
</script>
```
Theme Provider is a HOC which can receive a theme object as a prop and then supply it to the child components.


> My Component.js
```
<template>
  <div>
    <div :class="classes.contained">
        This is a demo component.
    </div>
  </div>
</template>

<script>
import { withStyles } from 'nuxt-jss'
const styles = {
  contained: {
    padding: '15px'
  }
}
export default {
  styles,
  mixins: [withStyles]
}
</script>
```
In your components you will need to include a `withStyles` mixin which will enable the component to use the JSS code. 

You need to define a `styles` property in your component and `withStyles` will process this property and compose this with the theme object and generate styles for the component. The generated Styles will be assigned on a classes property in the component data. 
