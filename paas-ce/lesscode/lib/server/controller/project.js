/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import projectModel from '../model/project'

module.exports = {
    async createProject (ctx) {
        const data = ctx.request.body
        try {
            const res = {
                code: 0,
                message: 'OK',
                data: null
            }

            // 检查名称和英文ID的唯一性
            const { projectName, projectCode } = data
            const [foundNameProject, foundCodeProject] = await Promise.all([
                projectModel.findOneProjectByName(projectName),
                projectModel.findOneProjectByCode(projectCode)
            ])

            if (foundNameProject) {
                res.code = 10001
                res.message = '项目名称已经存在'
            } else if (foundCodeProject) {
                res.code = 10002
                res.message = '项目ID已经存在'
            } else {
                const { id } = await projectModel.createProject(data)
                res.data = id
            }

            ctx.send(res)
        } catch (e) {
            ctx.send({
                code: 99999,
                message: e.message,
                data: null
            })
        }
    },

    async queryProject (ctx) {
        const projectList = await projectModel.qeuryProject({})
        const pageList = await projectModel.queryProjectPage()

        // 按projectId分组
        const pageMap = {}
        pageList.forEach((page) => {
            if (pageMap[page.projectId]) {
                pageMap[page.projectId].push(page)
            } else {
                pageMap[page.projectId] = [page]
            }
        })

        // 按页面更新时间倒序
        projectList.forEach(project => {
            if (pageMap[project.id]) {
                project['pageUpdateTime'] = pageMap[project.id][0].updateTime
            }
        })
        projectList.sort((a, b) => {
            return b.pageUpdateTime - a.pageUpdateTime
        })

        ctx.send({
            code: 0,
            message: '',
            data: {
                projectList,
                pageMap
            }
        })
    },

    async updateProject (ctx) {
        try {
            const { id, fields } = ctx.request.body
            const { affected } = await projectModel.updateProject(id, fields)
            ctx.send({
                code: 0,
                message: 'OK',
                data: affected
            })
        } catch (e) {
            ctx.send({
                code: 99999,
                message: e.message,
                data: null
            })
        }
    },

    async checkname (ctx) {
        const { name } = ctx.request.body
        const res = {
            code: 0,
            message: 'OK',
            data: null
        }
        try {
            const foundNameProject = await projectModel.findOneProjectByName(name)
            if (foundNameProject) {
                res.code = 10001
                res.message = '项目名称已经存在'
            }
            ctx.send(res)
        } catch (e) {
            ctx.send({
                code: 99999,
                message: e.message,
                data: null
            })
        }
    }
}
