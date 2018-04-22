const { checkPassword } = require('../service/user');
const { controller, get, post, put, del } = require('../lib/decorator');

@controller('api/v0/user')
export class movieController {
    @get('/')
    async login (ctx, next) {
        const { type, year } = ctx.query; 
        const matchData = await checkPassword(email, password);

        if (!matchData.user) {
            return (ctx.body= {
                success: false,
                err: '用户不存在'
            })
        }
        if (matchData.match) {
            return (ctx.body= {
                success: true,
                err: ''
            })
        }

        return (ctx.body = {
            success: false,
            err: '密码不正确'
        });
    }
}