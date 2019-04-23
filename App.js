import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Stopwatch from './app/components/stopwatch/Stopwatch';

export default class App extends Component{
  render() {
    return (
       <Stopwatch />
    );
  }
}