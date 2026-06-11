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

async function previewAndPrintReport(action, options, env) {
    // Only intercept PDF report actions (ir.actions.report with qweb-pdf).
    // This does NOT affect attachment previews in chatter, which use /web/content.
    if (action.report_type !== "qweb-pdf") {
        return false;
    }

    const url = getReportUrl(action, "pdf");

    // Hidden iframe: same-origin so contentWindow.print() is allowed.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.src = url;
    document.body.appendChild(iframe);

    const doPrint = () => {
        try {
            iframe.contentWindow.print();
        } catch (e) {
            // If the iframe print fails (timing or viewer issue),
            // fall back to opening the PDF in a new tab.
            window.open(url, "_blank");
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }
    };

    // PDF viewers inside iframes don't reliably fire onload, so use a
    // short delay to let the viewer initialise before calling print().
    setTimeout(doPrint, 200);

    // Clean up the hidden iframe after a reasonable window.
    setTimeout(() => {
        if (iframe.parentNode) {
            document.body.removeChild(iframe);
        }
    }, 120000);

    // Returning true tells Odoo's action service that we've handled
    // the report action; it will skip the default download path.
    return true;
}

registry
    .category("ir.actions.report handlers")
    .add("prt_report_attachment_preview", previewAndPrintReport);
