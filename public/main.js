function Validator(selector) {
  let formRules = {};

  let ValidatorRules = {
    // object để định nghĩa rules
    required(value) {
      return value ? undefined : "Please input this filed";
    },
    email(value) {
      let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regExp.test(value) ? undefined : "This field must be email";
    },
    min(min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Enter at least ${min} characters`;
      };
    },
  };

  //Lấy ra form trong DOM theo "selector"
  let formElement = document.querySelector(selector);

  //Chỉ xử lý khi lấy được form ra
  if (formElement) {
    let inputs = formElement.querySelectorAll("input[name][rules]");
    for (let input of inputs) {
      let rules = input.getAttribute("rules").split("|");
      for (let rule of rules) {
        let isRulesHasValue = rule.includes(":");
        //Gán cho biến is...Value = true/false sau khi kiểm tra xem trong chuỗi rule có dấu : không

        let ruleInfo;

        //nếu đúng thì cắt thành mảng , sau đó gán đè lại rule = value đầu tiên trong mảng ("min");
        if (isRulesHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        //Gán các function định nghĩa cho biến ruleFunc
        let ruleFunc = ValidatorRules[rule];

        //Kiểm tra lại, nếu đúng thì gọi hàm ruleFunc(ruleInfo[1]) => same function(min)
        // hàm trên trả về 1 hàm được return function()....để trả về hàm kiểm tra value luôn
        if (isRulesHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }
    }
    console.log(formRules);
  }
}

Validator("#form-1");
