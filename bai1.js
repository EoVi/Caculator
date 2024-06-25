import React from 'react';
import {View, Text, TextInput, Button, StyleSheet,TouchableOpacity} from 'react-native'
import { useState } from 'react';

const Bai1=() => {
    
    const [danhsachText,setTodoText] = useState('');
    const [todoList,setTodoList]=useState([]);

    function Nhap(textChanged){
        setTodoText(textChanged);
    }

    function AddDanhsach(){
        setTodoList((currenttodoList) => [...currenttodoList,danhsachText]);
    }
    return(
        <View style={styles.container}>
            <View style={styles.containernhapvao}> 
                <TextInput onChangeText={Nhap} placeholder='Nhập tại đây' style={styles.textinput} />
                <TouchableOpacity onPress={AddDanhsach} style={styles.styleButton}>
                    <Text style={styles.buttonText}>
                        Nhập
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.danhsach}>
                <Text> zxcvbn</Text>
                {todoList.map((todo) => <Text >{todo}</Text>)}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        paddingTop:20,
        marginHorizontal:10,
    },
    containernhapvao:{
        flexDirection:'row',
        flex:1,
        marginBottom:10,
        borderBottomWidth:3,
        borderBottomColor : 'green',
        paddingBottom:80
    },
    Danhsach:{
      flex:4
    },
    styleButton:{
        width: 80,
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
        alignItems: 'center', // Căn giữa nội dung theo chiều ngang
        borderRadius: 10, // Tùy chọn, để bo tròn góc của button
        height:50
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
      },
    textinput:{
        borderWidth:3,
        borderColor:'green',
        borderRadius: 10,
        padding:10,
        marginRight:20,
        width:'75%',
        height:50,
       
    },
  
})
export default Bai1

