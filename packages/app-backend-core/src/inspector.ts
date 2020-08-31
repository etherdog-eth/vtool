import { App } from '@vue/devtools-api'
import { BackendContext, CustomInspector } from '@vue-devtools/app-backend-api'
import { BridgeEvents, stringify } from '@vue-devtools/shared-utils'
import { getAppRecordId } from './app'

export function getInspector (inspectorId: string, app: App, ctx: BackendContext) {
  return ctx.customInspectors.find(i => i.id === inspectorId && i.app === app)
}

export function getInspectorWithAppId (inspectorId: string, appId: number, ctx: BackendContext) {
  return ctx.customInspectors.find(i => i.id === inspectorId && getAppRecordId(i.app) === appId)
}

export async function sendInspectorTree (inspector: CustomInspector, ctx: BackendContext) {
  const rootNodes = await ctx.api.getInspectorTree(inspector.id, inspector.app, inspector.treeFilter)
  ctx.bridge.send(BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_TREE, {
    appId: getAppRecordId(inspector.app),
    inspectorId: inspector.id,
    rootNodes
  })
}

export async function sendInspectorState (inspector: CustomInspector, ctx: BackendContext) {
  const state = inspector.selectedNodeId ? await ctx.api.getInspectorState(inspector.id, inspector.app, inspector.selectedNodeId) : null
  ctx.bridge.send(BridgeEvents.TO_FRONT_CUSTOM_INSPECTOR_STATE, {
    appId: getAppRecordId(inspector.app),
    inspectorId: inspector.id,
    state: stringify(state)
  })
}
