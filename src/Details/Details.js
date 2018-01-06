import React from 'react'
import { StyleSheet, Text, View, FlatList, StatusBar, Button } from 'react-native'
import request from 'superagent'
import { List, ListItem, SearchBar } from "react-native-elements"
import { StackNavigator } from 'react-navigation'

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: this.props.navigation.state.params.item,
      data: this.props.navigation.state.params.data,
      tickerData: null
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.item[0],
    headerRight: <Button 
      title="Edit"
      onPress={() => navigation.navigate('Edit', { item: navigation.state.params.item })}  
    />
  });

  componentDidMount() {
    this.getData()
    this.interval = setInterval(() => this.getData(), 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  getData() {
    this.getPolo()
  }

  getPolo() {
    request.get('https://poloniex.com/public?command=returnTicker')
      .end((err, res) => {
        if (err) return console.log("error: ", err)
        this.setState({ tickerData: res.body })
      })
  }

  render = () => {
    const { navigate } = this.props.navigation
    return (
      <View>
        <List>
          <ListItem
            hideChevron={true}
            title={`Currency: ${this.state.item[0]}`}
          />
          <ListItem
            hideChevron={true}
            title={`Amount: ${this.state.item[1]}`}
          />
          <ListItem
            hideChevron={true}
            title={`Purchase Price: $${this.state.item[2]}`}
          />
          <ListItem
            hideChevron={true}
            title={`Unit Price: $${this.state.item[2] / this.state.item[1]}`}
          />
          {this.state.tickerData && this.state.item ? <ListItem
            hideChevron={true}
            title={`Current value: $${eval(this.state.tickerData['USDT_' + this.state.item[0]].last * this.state.item[1])}`}
          /> : null }
          {this.state.tickerData && this.state.item ? <ListItem
            hideChevron={true}
            title={`P/L: $${eval(this.state.tickerData['USDT_' + this.state.item[0]].last * this.state.item[1] - this.state.item[2])}`}
          /> : null }
          {this.state.tickerData && this.state.item ? <ListItem
            hideChevron={true}
            title={`Unit P/L: $${(eval(this.state.tickerData['USDT_' + this.state.item[0]].last * this.state.item[1] - this.state.item[2])) / this.state.item[1]}`}
          /> : null }
        </List>
      </View>
    )
  }
}