
// https://zhuanlan.zhihu.com/p/392303778/
module.exports = {
    writerOpts: {
        // eslint-disable-next-line no-unused-vars
        transform: (commit, context) => {
            if (commit.header === 'edi' || commit.header === 'eid' || commit.header === '同步' || commit.header === '更新' || commit.header === '模板更新') {
                console.log(commit)
                return false
            }
            return commit
        },
    }
}