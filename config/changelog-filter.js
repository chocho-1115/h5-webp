
// https://zhuanlan.zhihu.com/p/392303778/
module.exports = {
    writerOpts: {
        // eslint-disable-next-line no-unused-vars
        transform: (commit, context) => {
            if (commit.header === 'edi' || commit.header === 'eid' || commit.header === '同步' || commit.header === '更新') {
                console.log(commit.header)
                return false
            }
            return commit
        },
    }
}