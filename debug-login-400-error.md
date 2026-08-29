# [OPEN] login-400-error

## Bug Summary
- Symptom: 线上登录请求 `POST /api/login` 返回 `400 Bad Request`
- Expected: 使用正确账号密码后应成功登录，至少返回明确的业务错误提示而不是前端未处理的 Promise 拒绝
- Environment: production, frontend built assets, backend `http://1.92.82.236:3000/api`

## Hypotheses
1. 前端提交字段名与后端 DTO 不一致，例如前端发 `account`，后端要求 `username` 或 `email`
2. 请求体格式不符合后端校验要求，例如缺少字段、空字符串、Content-Type 不匹配
3. 线上环境变量或 `apiUrl` 配置错误，命中了错误服务或错误路径
4. 登录页表单值在提交前被错误清空、裁剪或转换，导致实际请求 payload 非预期
5. 后端登录接口新增了更严格的参数校验，但前端仍沿用旧契约

## Evidence Plan
- 检查前端登录 API 封装与登录表单提交参数
- 对照后端登录接口契约，确认字段名和请求结构
- 如静态证据不足，再做最小化插桩采集请求 payload 与响应体

## Status
- Current step: collecting evidence
