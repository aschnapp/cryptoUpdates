import React from 'react'
import { StyleSheet, View, FlatList, StatusBar, AsyncStorage } from 'react-native'
import request from 'superagent'
import { List, ListItem, SearchBar, Button, Icon } from "react-native-elements"
import { StackNavigator } from 'react-navigation'
import Ionicons from 'expo'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      tickerData: null
    }
    this.navigate = this.props.navigation.navigate
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Holdings',
    headerRight: <Icon
      name='add'
      type='md'
      containerStyle={{ paddingRight: 15 }}
      onPress={() => navigation.navigate('Edit', {})}
    />
  })

  componentWillMount() {
    this.initData()
  }

  
  componentDidMount() {
    this.getData()
    this.interval = setInterval(() => {
      this.getData(); 
      this.initData()
    }, 10000)
  }

  async initData() {
    try {
      let data = await AsyncStorage.getItem('data')
      data =  JSON.parse(data)
      if (data !== null) return this.setState({ data })
      data = {}
      await AsyncStorage.setItem('data', JSON.stringify(data))
      this.setState({data: data})
    } catch (error) {
      console.log('err:', error)
    }
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

  handlepress = (item, navigate, loc) => {
    if (loc === 'Details') {
      return navigate('Details', { item: item })
    }
    if (item === null) {
      navigate('Edit',{ data: null, item: null })
    }
  }

  _renderItem = (item, navigate) => {
    if (this.state.tickerData && this.state.tickerData[`USDT_${item[0]}`]) {
      return <ListItem
        title={`${item[0]}: $${eval(this.state.tickerData['USDT_' + item[0]].last * item[1])}`}
        subtitle={`${item[0]} ${item[1]} at $${this.state.tickerData['USDT_' + item[0]].last} each`}
        onPress={() => this.handlepress(item, navigate, 'Details')}
      />
    }
  }

  _keyExtractor(item, index) {
    return index
  }

  render() {
    return (
      <View style={styles.container}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={Object.values(this.state.data)}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => this._renderItem(item, this.navigate)}
            extraData={this.state}
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: '#000'
  },
  container: {
    // flex: 1
  }
});