export default {
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur',
    },
  ],
  pass: [
    {
      validator: (rule, value, callback) => {
        console.log(value);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};
