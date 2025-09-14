export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 144, 
      unitPrecision: 5, 
      propList: ['*'], 
      selectorBlackList: ['.norem', '.ant-'], 
      replace: true, 
      mediaQuery: false, 
      minPixelValue: 1,
      exclude: /node_modules/i 
    }
  }
}
