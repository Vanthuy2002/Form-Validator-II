function Validator(selector, options = {}) {
  function getParent(currentEl, selector) {
    while (currentEl.parentElement) {
      if (currentEl.parentElement.closest(selector)) {
        return currentEl.parentElement;
      }
      currentEl = parentElement;
    }
  }

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

    //Lặp qua các thẻ input
    for (let input of inputs) {
      // cắt giá trị trong rules thành mảng
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

        //Kiểm tra xem value trong object có phải là Array không?
        //Lần đầu chạy sẽ lọt vào else bởi chưa phải là mảng, sau đó sẽ tiến hành push vào
        //mảng "key" trong object
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      //lắng nghe sự kiện blur trong input
      input.onblur = handleValidate;
      input.oninput = clearMess;
      function handleValidate(e) {
        let valueOfFormRules = formRules[e.target.name];

        let errMsg;
        valueOfFormRules.find((value) => {
          errMsg = value(e.target.value);
          return errMsg;
        });

        // Nếu có lỗi , render ra UI
        if (errMsg) {
          let formGroup = getParent(e.target, ".form-group");
          if (formGroup) {
            //Nếu có form-group thì lấy ra class mess, gán thông báo lỗi vào
            formGroup.classList.add("invalid");
            let formMess = formGroup.querySelector(".form-message");
            formMess.textContent = errMsg;
          }
        }

        return !errMsg;
      }

      function clearMess(e) {
        let formGroup = getParent(e.target, ".form-group");
        if (formGroup.classList.contains("invalid")) {
          formGroup.classList.remove("invalid");
        }
        let formMess = formGroup.querySelector(".form-message");
        formMess.textContent = "";
      }
    }
  }
  //Nhận lại được object có key là name trong thẻ input, value tương ứng là các hàm đã định nghĩa
  formElement.onsubmit = (e) => {
    e.preventDefault();
    let inputs = formElement.querySelectorAll("input[name][rules]");

    //Lặp qua các thẻ input
    let isValid = true;
    for (let input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }
    if (isValid) {
      if (typeof options.onSubmit === "function") {
        return options.onSubmit();
      }

      formElement.submit();
    }
  };
}

Validator("#form-1", {
  onSubmit: function () {
    //Lấy ra toàn bộ value, => gọi API
    console.log("Pass");
  },
});
