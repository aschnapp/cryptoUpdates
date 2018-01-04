import React from 'react'
import { StyleSheet, View, FlatList, StatusBar} from 'react-native'
import request from 'superagent'
import { List, ListItem, SearchBar } from "react-native-elements"
import { StackNavigator } from 'react-navigation'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [[5, 'ETH'], [2956.820051, 'XRP']],
      tickerData: null
    }
  }

  static navigationOptions = {
    title: 'Holdings'
  };

  componentDidMount() {
    this.getPolo()
    this.interval = setInterval(() => this.getPolo(), 10000)
  }
  
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  getPolo() {
    request.get('https://poloniex.com/public?command=returnTicker')
      .end((err, res) => {
        if (err) return console.log("error: ", err)
        this.setState({ tickerData: res.body })
      })
  }

  handlepress = (item, navigate) => {
    navigate('Details', { "data": this.state.tickerData['USDT_' + item[1]], item: item })
  }

  _renderItem = (item, navigate) => {
    if (this.state.tickerData && this.state.tickerData[`USDT_${item[1]}`]) {
      return <ListItem
        title={`${item[1]}: $${eval(this.state.tickerData['USDT_' + item[1]].last * item[0])}`}
        subtitle={`${item[0]} ${item[1]} at $${this.state.tickerData['USDT_' + item[1]].last} each`}
        onPress={() => this.handlepress(item, navigate)}
      />
    }
  }

  _keyExtractor(item, index) {
    return index
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => this._renderItem(item, navigate)}
            extraData={this.state}
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1
  }
});