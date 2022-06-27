import { User } from "@/service";
import utils from "@/utils/utils";
const { storage } = utils;
export default {
    name: "Login",
    data() {
        return {
            loading: false,
            remember: true,
            code: "/api/login/checkcode",
            // 表单数据收集
            forms: {
                userName: "",
                password: "",
                img: ""
            },
            // 登录界面验证功能
            rules: {
                userName: {
                    required: true,
                    message: "请输入账号",
                    trigger: "blur"
                },
                password: {
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                },
                img: {
                    required: true,
                    message: "您还没有输入验证码",
                    trigger: "blur"
                }
            }
        };
    },
    created() {
        this.initPwdLocal();
    },
    methods: {
        resetCode() {
            this.code = `${this.code}?t=${+new Date()}`;
            this.forms.img = "";
        },
        async submit() {
            let result = await this.$refs.forms.validate();
            if (!result) return;
            this.loading = true;
            try {
                let { data } = await User.login(
                    this.$QS.stringify(this.forms)
                );
                this.loading = false;
                this.$Message.success("登录成功");
                this.pwdlocal();
                this.$store.commit("users/users", data);
                this.$router.replace({ name: "User" });
            } catch (e) {
                this.loading = false;
                this.resetCode();
            }
        },
        //记住密码
        pwdlocal() {
            if (this.remember) {
                storage.setLocal("password", this.forms.password);
                storage.setLocal("userName", this.forms.userName);
            } else {
                storage.setLocal("password", "");
                storage.setLocal("userName", "");
            }
        },
        //获取密码
        initPwdLocal() {
            if (this.remember) {
                this.forms.password = storage.getLocal("password")||"";
                this.forms.userName = storage.getLocal("userName")||"";
            }
        }
    }
};