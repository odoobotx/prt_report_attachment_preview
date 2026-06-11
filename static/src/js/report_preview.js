/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _t } from "@web/core/l10n/translation";

function getReportUrl(action, type) {
    let url = `/report/${type}/${action.report_name}`;
    const actionContext = action.context || {};
    if (action.data && JSON.stringify(action.data) !== "{}") {
        const options = encodeURIComponent(JSON.stringify(action.data));
        const context = encodeURIComponent(JSON.stringify(actionContext));
        url += `?options=${options}&context=${context}`;
    } else {
        if (actionContext.active_ids) {
            url += `/${actionContext.active_ids.join(",")}`;
        }
    }
    return url;
}

async function previewReportInBrowser(action, options, env) {
    if (action.report_type !== "qweb-pdf") {
        return false;
    }

    const url = getReportUrl(action, "pdf");
    const w = window.open(url, "_blank");
    if (!w || w.closed || typeof w.closed === "undefined") {
        env.services.notification.add(
            _t("A popup window with your report was blocked. You may need to change your browser settings to allow popup windows for this page."),
            { sticky: true, title: _t("Warning") }
        );
    }

    return true;
}

registry.category("ir.actions.report handlers").add("prt_report_attachment_preview", previewReportInBrowser);
