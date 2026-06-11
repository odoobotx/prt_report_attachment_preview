{
    'name': 'Open PDF Reports in Browser',
    'version': '18.0.1.0.0',
    'summary': 'Open PDF reports in browser instead of downloading them',
    'author': 'Techsystech',
    'category': 'Productivity',
    'license': 'LGPL-3',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'prt_report_attachment_preview/static/src/js/report_preview.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
