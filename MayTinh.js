import React, { toString, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { create } from 'react-test-renderer';
import Icon from 'react-native-vector-icons/FontAwesome6';
const App = () => {
  // Sử dụng useState để quản lý trạnyg thái của màn hình hiển thị và kết quả
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [isResultDisplayed, setIsResultDisplayed] = useState(false); // Kiểm tra xem kết quả có vừa được tính toán không
  const isLastCharOperator = (str) => {
  return /[+\-*/(]/.test(str[str.length - 1]);
  };
const tinhToan = (expression) => {
  // Định nghĩa các hàm cho các toán tử
  const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };

  // Hàm tính toán các phần tử đã được phân tích
  const xuLy = (tokens) => {
    // Xử lý phép nhân và chia trước
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '*' || tokens[i] === '/') {
        const [left, operator, right] = [parseFloat(tokens[i - 1]), tokens[i], parseFloat(tokens[i + 1])];
        const result = operators[operator](left, right);
        tokens.splice(i - 1, 3, result); // Thay thế phần tử đã xử lý bằng kết quả
        i--; // Giảm chỉ số i để tiếp tục xử lý mảng đã được cập nhật
      }
    }

    // Xử lý phép cộng và trừ
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const [operator, nextNumber] = [tokens[i], parseFloat(tokens[i + 1])];
      result = operators[operator](result, nextNumber);
    }

    return result; // Trả về kết quả cuối cùng
  };

  // Hàm phân tích biểu thức thành các phần tử
  const parseExpression = (expression) => {
    let tokens = [];
    let Luu_tru_so = [];
    let i = 0;

    // Duyệt qua từng ký tự của biểu thức
    while (i < expression.length) {
      const char = expression[i];

      if (/\d|\./.test(char)) { // Nếu ký tự là số hoặc dấu chấm
        Luu_tru_so.push(char);
      } else if (/\D/.test(char)) { // Nếu ký tự không phải là số
        if (Luu_tru_so.length) {
          tokens.push(Luu_tru_so.join('')); // Thêm số vào tokens
          Luu_tru_so = [];
        }

        if (char === '(') { // Nếu ký tự là dấu ngoặc mở
          let bracketCount = 1;
          let j = i + 1;
          while (j < expression.length && bracketCount > 0) {
            if (expression[j] === '(') bracketCount++;
            if (expression[j] === ')') bracketCount--;
            j++;
          }

          tokens.push(parseExpression(expression.slice(i + 1, j - 1))); // Đệ quy phân tích biểu thức bên trong dấu ngoặc
          i = j - 1;
        } else {
          tokens.push(char); // Thêm toán tử vào tokens
        }
      }

      i++;
    }

    if (Luu_tru_so.length) {
      tokens.push(Luu_tru_so.join('')); // Thêm số cuối cùng vào tokens
    }

    return xuLy(tokens); // Tính toán kết quả từ các token
  };

  return parseExpression(expression); // Bắt đầu phân tích biểu thức đầu vào
};
  // Hàm này sẽ được gọi khi bấm nút
  const handlePress = (value) => {
    if (isResultDisplayed) {
    setDisplay(value); // Xóa biểu thức hiện tại nếu kết quả vừa được hiển thị
      if(value=='DEL'||value=='='||value=='C') setDisplay('')
    setIsResultDisplayed(false); // Đặt lại trạng thái isResultDisplayed
  }
    else if (value=='=' && display=='') setResult('0')

    else if (value == '=') {
      try {
        // Tính toán kết quả bằng cách sử dụng hàm tinh toán
        setResult(tinhToan(display).toString());
        setIsResultDisplayed(true); // Đặt trạng thái isResultDisplayed là true sau khi tính toán kết quả
      } catch (error) {
        setResult('Error'); // Xử lý lỗi nếu có
        setIsResultDisplayed(true); // Đặt trạng thái isResultDisplayed là true sau khi tính toán kết quả
      }
    } else if (value == 'C') {
      // Xóa màn hình hiển thị và kết quả khi bấm nút 'C'
      setDisplay('');
      setResult('0');
      setIsResultDisplayed(false); // Đặt lại trạng thái isResultDisplayed
    } else if (value === '.') {
      // Nếu ký tự cuối cùng là toán tử hoặc màn hình hiển thị đang trống, không cho phép thêm dấu chấm
      if (isLastCharOperator(display) || display === '') 
      return;
    } 
      // Xóa kí tự vừa nhập
      else if (value == 'DEL'){
        handleBackspace(display + value);
      }
      else if (value =='X') setDisplay('');
      else if (/[+\-*/]/.test(value)) { // Kiểm tra xem giá trị nhấn có phải là toán tử không
        if (display === '' && (value !== '-'||value !== '+')) return; // Nếu display rỗng, chỉ cho phép toán tử '-' để bắt đầu biểu thức
        if (isLastCharOperator(display)) {
          setDisplay(display.slice(0, -1) + value); // Thay thế toán tử cuối cùng nếu nó là toán tử
        } else {
      setDisplay(display + value); // Thêm toán tử vào biểu thức hiện tại
    }
  }
      else {
      // Cập nhật màn hình hiển thị khi bấm các nút khác
      setDisplay(display + value);
    }
  };
  //tạo hàm xóa kí tự
  const handleBackspace = () => {
    setDisplay(display.slice(0, -1)); // Xóa ký tự cuối cùng trong input
  };
  const buttonIconsOrder = [
    '7', '8', '9', '+', 
    '4', '5', '6', '-', 
    '1', '2', '3', '*', 
    'C', '0', '.', '/', 
    '(', ')','DEL','='
  ];
  const buttonIcons = {
    '7': '7',
    '8': '8',
    '9': '9',
    '/': 'divide',
    '4': '4',
    '5': '5',
    '6': '6',
    '*': 'xmark',
    '1': '1',
    '2': '2',
    '3': '3',
    '-': 'minus',
    'C': 'c',
    '0': '0',
    '.': 'key',
    '+': 'plus',
    // ')': 'parenthesis',
    // '(': 'parenthesis',
    'DEL': 'delete-left',
    '=': 'equals',
  };
  const keys = Object.keys(buttonIcons);
  return (
    
    <View style={styles.container}>
      {/* Màn hình hiển thị */}
      <StatusBar backgroundColor="black"/>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>
      {/* Các nút bấm */}
      <View style={styles.buttonsContainer}>
        {buttonIconsOrder.map((value) => (
        <TouchableOpacity
            key={value}
            style={styles.button}
            onPress={() => handlePress(value)}
          >
            {value !== '(' && value !== ')'&& value !== '.' ? (
              <Icon name={buttonIcons[value]} size={30} color="#000" />
            ) : (
              <Text style={styles.buttonText}>{value}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Định nghĩa các kiểu dáng cho các thành phần
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#7ab8bf',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#d9cd91',
    borderTopRightRadius:13,
    borderTopLeftRadius:13,
  },
  displayText: {
    fontSize: 40,
  },
  resultText: {
    fontSize: 30,
    color: '#d9765f',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#f2d5d5',
    borderBottomLeftRadius:13,
    borderBottomRightRadius:13,
    flex:2
  },
  button: {
    width: '23%',
    height: 98,
    backgroundColor: '#d9165f',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    fontWeight:'bold'
  },
});

export default App;