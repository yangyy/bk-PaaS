<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <section>
        <bk-input
            disabled
            style="width: 100%"
            type="textarea"
            :rows="5"
            :value="initJsonStr" />
        <div class="option-add" @click="showEdit">编辑数据</div>

        <bk-dialog
            v-model="isShow"
            :confirm-fn="confirm"
            @cancel="cancel"
            render-directive="if"
            width="900"
            ext-cls="json-setting-dialog">
            <main class="main-container">
                <div class="init-json">
                    <textarea class="json-input" placeholder="请输入json格式的数据" v-model="initJsonStr"></textarea>
                </div>
                <div class="transform-json">
                    <json-viewer
                        :value="initJson"
                        :expand-depth="5"
                    ></json-viewer>
                </div>
            </main>
        </bk-dialog>
    </section>
</template>

<script>
    import Vue from 'vue'
    import JsonViewer from 'vue-json-viewer'
    Vue.use(JsonViewer)
    export default {
        props: {
            defaultValue: {
                type: Object,
                required: true
            },
            change: {
                type: Function,
                default: () => {}
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },

        data () {
            return {
                isShow: false,
                initJsonStr: '',
                localValue: {}
            }
        },
        computed: {
            initJson () {
                if (this.initJsonStr) {
                    try {
                        return JSON.parse(this.initJsonStr)
                    } catch (e) {
                        return '解析error: ' + '请输入正确的json格式数据'
                    }
                }
                return {}
            }
        },
        // watch: {
        //     isShow: {
        //         handler (val) {
        //             if (!val) {
        //                 this.initJsonStr = JSON.stringify(this.defaultValue, null, 4)
        //             }
        //         },
        //         immediate: true
        //     }
        // },
        created () {
            this.localValue = this.defaultValue
            this.initJsonStr = JSON.stringify(this.defaultValue, null, 4)
        },
        methods: {
            showEdit () {
                this.isShow = true
            },
            confirm () {
                try {
                    if (this.initJsonStr && typeof JSON.parse(this.initJsonStr) === 'object') {
                        this.localValue = JSON.parse(this.initJsonStr)
                        this.change(this.name, JSON.parse(this.initJsonStr), this.type)
                        this.isShow = false
                    }
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '请输入正确的json格式数据'
                    })
                }
            },
            cancel () {
                this.initJsonStr = JSON.stringify(this.localValue, null, 4)
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/scroller";
    .json-setting-dialog {
        /deep/ .bk-dialog {
            position: initial;
            /* &.ease-enter-active.ease-enter-to {
                animation: none!important;
            } */
            .bk-dialog-content {
                top: calc(50vh - 324px)!important;
            }
        }
        .main-container {
            width: 98%;
            height: 500px;
            display:flex;
            overflow: hidden;
            margin: 0 auto;
            border: solid 1px #E5EBEE;
            > div {
                border-right: solid 1px #E5EBEE;
                overflow: auto;
                @mixin scroller;
            }
            .init-json {
                flex: 1;
                overflow: hidden;
                margin-top: 10px;
                .json-input {
                    border: 0px;
                    width: 100%;
                    height: 100%;
                    @mixin scroller;
                }
            }
            .transform-json {
                flex: 1;
            }
        }
    }
    .option-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff
    }
</style>
