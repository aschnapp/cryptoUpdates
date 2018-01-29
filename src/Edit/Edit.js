import React from 'react'
import {
  StyleSheet,
  Text,
  View, ScrollView,
  Button,
  AsyncStorage
} from 'react-native';
import { List } from "react-native-elements"
import { StackNavigator } from 'react-navigation'
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField, DatePickerField, TimePickerField
} from 'react-native-form-generator'
import { NavigationActions } from 'react-navigation'

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      currency: null,
      cryptoAmount: 0,
      purchasePrice: 0,
      error: null,
      success: null
    } 
  }
  
  static navigationOptions = ({ navigation, screenProps }) => {
    const { state } = navigation
    return {
      title: navigation.state.params.item ? `Edit: ${navigation.state.params.item[0]}` : 'Add Investment',
      headerRight: <Button onPress={() => state.params.handleSave()} title="Save"/>
    }
  }
  
  componentDidMount = () => {
    this.getData()
    this.props.navigation.setParams({ handleSave: this.setSave })
    
  }

  verifyPreset = () => {
    let item = this.props.navigation.state.params.item
    if (item && this.data) {
      if (!this.data[item[0]]) return this.setState({ error: `Data does not match currency: ${item[0]} ${this.data[item[0]]}` })
      if (this.data[item[0]][1] !== item[1]) this.setState({ error: `Data does not match amount: ${item[1]} ${this.data[item[0]][1]}` })
      if (this.data[item[0]][2] !== item[2]) this.setState({ error: `Data does not match purchase price: ${item[2]} ${this.data[item[0]][2]}`})
    } 
    this.setState({
      currency: this.data[item[0]][0],
      cryptoAmount: this.data[item[0]][1],
      purchasePrice: this.data[item[0]][2],
    })
  }

  setSave = () => {
    this.handleSave()
  }

  async getData() {
    try {
      const data = await AsyncStorage.getItem('data')
      if (data) {
        this.data = JSON.parse(data)
        return this.verifyPreset()
      }
      this.data = {}
    } catch (error) {
      this.setState({ error })
    }
  }

  handleSave() {
    const data = [ this.state.currency, this.state.cryptoAmount, this.state.purchasePrice ]
    this.data[this.state.currency] = data
    this.saveData(this.data)
  }

  async saveData(data) {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(data))
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Home'})
        ]
      }));
      this.setState({ success: "Success!" })
    } catch (error) {
      this.setState({ error })
      console.log(error)
    }
  }

  handlePickerChange = (currency) => {
    this.setState({ currency })
  }

  handleInputChange = (value, type) => {
    this.setState({ [type]: value })
  }

  render = () => {
    if (this.state.error) console.log(this.state.error)
    const { navigate } = this.props.navigation
    const { item } = this.props.navigation.state.params
    return (
      <View>
        {this.state.success ? <Text>Success!</Text> : null}
        <Form ref="input">
          <PickerField 
            value={item ? item[0] : "Choose currency"}
            label="Currency"
            onValueChange={(value) => this.handlePickerChange(value)}
            options={{
              "BTC": "BTC",
              "ETH": "ETH",
              "XRP": "XRP",
              "DASH": "DASH",
              "LTC": "LTC",
              "NXT": "NXT",
              "XLM": "XLM",
              "XMR": "XMR",
              "ZEC": "ZEC",
              "BCH": "BCH"
            }}
          />
          <InputField
            setValue={this.state.cryptoAmount}
            onValueChange={(value) => this.handleInputChange(value, 'cryptoAmount')}
            label='Total amount'
            placeholder={item ? item[1] : "0"}
          />
          <InputField
            onValueChange={(value) => this.handleInputChange(value, 'purchasePrice')}
            label='Purchase Price'
            placeholder={item ? item[2] : "0"}
          />
        </Form>
      </View>
    )
  }
}