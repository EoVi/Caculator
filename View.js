import React, { toString, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { create } from 'react-test-renderer';

// Chuyển đổi biểu thức từ trung tố (infix) sang hậu tố (postfix) sử dụng Shunting Yard algorithm
const infixToPostfix = (infix) => {
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };
  const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
  const output = [];
  const operators = [];

  infix.forEach((token) => {
    if (!isNaN(token)) {
      output.push(token);
    } else if (isOperator(token)) {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
};

// Tính toán biểu thức hậu tố (postfix)
const evaluateExpression = (expression) => {
  const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };
  // Tách biểu thức thành các phần tử (số và toán tử)
  const tokens = expression.split(/(\D)/).filter(Boolean);

  // Xử lý phép nhân và chia trước
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      const [left, operator, right] = [parseFloat(tokens[i - 1]), tokens[i], parseFloat(tokens[i + 1])];
      const result = operators[operator](left, right);
      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  // Xử lý phép cộng và trừ
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const [operator, nextNumber] = [tokens[i], parseFloat(tokens[i + 1])];
    result = operators[operator](result, nextNumber);
  }

  return result;
};

const App = () => {
  const [display, setDisplay] = useState('');

  const handlePress = (value) => {
    if (value === '=') {
      try {
        const tokens = display.match(/(\d+|\D)/g); // Tách biểu thức thành các phần tử
        const postfix = infixToPostfix(tokens); // Chuyển đổi sang hậu tố
        const result = evaluatePostfix(postfix); // Tính toán kết quả
        setDisplay(result.toString());
      } catch (e) {
        setDisplay('Error');
      }
    } else if (value === 'C') {
      setDisplay(''); // Xóa toàn bộ input
    } else {
      setDisplay(display + value); // Thêm ký tự vào input
    }
  };

  const handleBackspace = () => {
    setDisplay(display.slice(0, -1)); // Xóa ký tự cuối cùng trong input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{display}</Text>
      <View style={styles.buttonsContainer}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '<-', '0', '=', '+', 'C'].map((value) => (
          <TouchableOpacity key={value} style={styles.button} onPress={() => value === '<-' ? handleBackspace() : handlePress(value)}>
            <Text style={styles.buttonText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  display: {
    width: '90%',
    height: 100,
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 36,
    textAlign: 'right',
    padding: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: '22%',
    height: 80,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default App;