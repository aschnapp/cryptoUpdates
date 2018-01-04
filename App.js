import React from 'react'
import { StyleSheet, View, FlatList, StatusBar } from 'react-native'
import request from 'superagent'
import { List, ListItem, SearchBar } from "react-native-elements"
import { StackNavigator } from 'react-navigation'
import Home from './src/Home/Home.js'
import Details from './src/Details/Details.js'
import Edit from './src/Edit/Edit.js'

const App = StackNavigator({
  Home: { screen: Home },
  Details: { screen: Details },
  Edit: { screen: Edit }
})

export default App
