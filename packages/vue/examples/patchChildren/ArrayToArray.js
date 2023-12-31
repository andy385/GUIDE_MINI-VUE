import { h, ref } from "../../lib/guide-mini-vue.esm.js";

// 1. 左侧对比
// a b c
// a b d e
// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ];
// const nextChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'D'}, 'D'),
//     h('p', {key: 'E'}, 'E'),
// ];

// 2. 右侧的对比
// a b c
// d e b c
// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ];
// const nextChildren = [
//     h('p', {key: 'D'}, 'D'),
//     h('p', {key: 'E'}, 'E'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ];

// 3. 新的比老的长
// 创建新的
// 左侧
// i: 2, e1: 1, e2: 2
// a b
// a b c

    // const pervChildren = [
    //     h('p', {key: 'A'}, 'A'),
    //     h('p', {key: 'B'}, 'B'),

    // ];
    // const nextChildren = [
    //     h('p', {key: 'A'}, 'A'),
    //     h('p', {key: 'B'}, 'B'),
    //     h('p', {key: 'C'}, 'C'),
    //     h('p', {key: 'D'}, 'D'),
    // ]

// 右侧
// a b
// c a b

// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),

// ];
// const nextChildren = [
//     h('p', {key: 'D'}, 'D'),
//     h('p', {key: 'C'}, 'C'),
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
// ]

// 4. 老的比新的长
// 左侧
// a b c
// a b
// i: 2, e1: 2, e2: 1

// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ];
// const nextChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
// ]

// 右侧
// a b c
// b c
// i: 0, e1: 0, e2: -1

// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ];
// const nextChildren = [
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C'}, 'C'),
// ]

// 5. 对比中间的部分
// 删除老的
// a b c d f g
// a b e c f g
// i: 2, e1: 4, e3: 3

// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C', id: 'prev-c'}, 'C'),
//     h('p', {key: 'D'}, 'D'),
//     h('p', {key: 'F'}, 'F'),
//     h('p', {key: 'G'}, 'G'),
// ];
// const nextChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'E'}, 'E'),
//     h('p', {key: 'C', id: 'next-c'}, 'C'),
//     h('p', {key: 'F'}, 'F'),
//     h('p', {key: 'G'}, 'G'),
// ]

// 移动
// 最长递增子序列 [1, 2]
// const pervChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'C', id: 'prev-c'}, 'C'),
//     h('p', {key: 'E'}, 'E'),
//     h('p', {key: 'F'}, 'F'),
//     h('p', {key: 'G'}, 'G'),
// ];
// const nextChildren = [
//     h('p', {key: 'A'}, 'A'),
//     h('p', {key: 'B'}, 'B'),
//     h('p', {key: 'E'}, 'E'),
//     h('p', {key: 'C', id: 'next-c'}, 'C'),
//     h('p', {key: 'D'}, 'D'),
//     h('p', {key: 'F'}, 'F'),
//     h('p', {key: 'G'}, 'G'),
// ]

// 总测试
const pervChildren = [
    h('p', {key: 'A'}, 'A'),
    h('p', {key: 'B'}, 'B'),
    h('p', {key: 'C', id: 'prev-c'}, 'C'),
    h('p', {key: 'D'}, 'D'),
    h('p', {key: 'E'}, 'E'),
    h('p', {key: 'Z'}, 'Z'),
    h('p', {key: 'F'}, 'F'),
    h('p', {key: 'G'}, 'G'),
];
const nextChildren = [
    h('p', {key: 'A'}, 'A'),
    h('p', {key: 'B'}, 'B'),
    h('p', {key: 'D'}, 'D'),
    h('p', {key: 'C', id: 'next-c'}, 'C'),
    h('p', {key: 'Y'}, 'Y'),
    h('p', {key: 'E'}, 'E'),
    h('p', {key: 'F'}, 'F'),
    h('p', {key: 'G'}, 'G'),
]



export default {
    name: 'ArrayToArray',
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;

        return {
            isChange
        }
    },

    render() {
        const self = this;

        return self.isChange ? h('div', {}, nextChildren) : h('div', {}, pervChildren)
    }
}