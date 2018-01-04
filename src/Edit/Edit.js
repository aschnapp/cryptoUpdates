import React from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar} from 'react-native'
import request from 'superagent'
import { List, ListItem, SearchBar } from "react-native-elements"
import { StackNavigator } from 'react-navigation'

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: this.props.navigation.state.params.item,
      data: this.props.navigation.state.params.data
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.item[1]
  });

  render = () => {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>Edit</Text>
      </View>
    )
  }
}