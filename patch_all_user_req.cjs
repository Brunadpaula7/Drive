const fs = require('fs');

// Patch App.tsx
try {
    let appCode = fs.readFileSync('App.tsx', 'utf8');
    const searchApp = `<CertidoesSection />
                <SalesLinksSection />`;
    const replaceApp = `<SalesLinksSection />
                <CertidoesSection />`;

    if (appCode.includes(searchApp)) {
        appCode = appCode.replace(searchApp, replaceApp);
        fs.writeFileSync('App.tsx', appCode);
        console.log("Patched App.tsx successfully.");
    } else {
        console.log("Could not find sections in App.tsx to swap.");
    }
} catch(e) {
    console.error("Error patching App.tsx", e);
}


// Patch CertidoesSection.tsx
try {
    let certCode = fs.readFileSync('components/CertidoesSection.tsx', 'utf8');
    
    // Change Title
    const searchTitle = `Checklist de Certidões
                </h3>`;
    const replaceTitle = `Certidões Cíveis, Criminais e Imóvel
                </h3>`;
    certCode = certCode.replace(searchTitle, replaceTitle);
    
    // Add Item 5. SAEC
    const imovelSearch = `        { 
            id: 'imovel-taxa', 
            nome: '4. Emissão de Guia (DUAM) IPTU/ITU', 
            link: 'https://tributos.goiania.go.gov.br/PortalTributos/ConsultaTributos', 
            descricao: 'Portal de Consulta e Geração de Boletos Vencidos.',
            importancia: 'Ferramenta corretiva e não atestatória. Utilizada na Due Diligence para gerar imediatamente as guias de recolhimento de eventuais inadimplências encontradas, destravando a emissão da CND Imobiliária.',
            obsPositiva: 'Não é certidão. Acesso rápido para gerar boletos pendentes.', 
            obsOQueSignifica: 'Acesso ao espelho do IPTU e emissão de segunda via para quitação.' 
        }
    ]`;

    const imovelReplace = `        { 
            id: 'imovel-taxa', 
            nome: '4. Emissão de Guia (DUAM) IPTU/ITU', 
            link: 'https://tributos.goiania.go.gov.br/PortalTributos/ConsultaTributos', 
            descricao: 'Portal de Consulta e Geração de Boletos Vencidos.',
            importancia: 'Ferramenta corretiva e não atestatória. Utilizada na Due Diligence para gerar imediatamente as guias de recolhimento de eventuais inadimplências encontradas, destravando a emissão da CND Imobiliária.',
            obsPositiva: 'Não é certidão. Acesso rápido para gerar boletos pendentes.', 
            obsOQueSignifica: 'Acesso ao espelho do IPTU e emissão de segunda via para quitação.' 
        },
        {
            id: 'imovel-saec',
            nome: '5. SAEC (Certidão Matrícula/Ônus)',
            link: 'https://ridigital.org.br/Acesso.aspx',
            descricao: 'Serviço de Atendimento Eletrônico Compartilhado (SAEC).',
            importancia: 'Permite solicitar certidões digitais de matrícula e verificar a existência de ônus, alienações ou penhoras averbadas na matrícula do imóvel.',
            obsOQueSignifica: 'Acesso às informações do Registro de Imóveis.'
        }
    ]`;
    
    certCode = certCode.replace(imovelSearch, imovelReplace);
    fs.writeFileSync('components/CertidoesSection.tsx', certCode);
    console.log("Patched CertidoesSection.tsx successfully.");
} catch(e) {
    console.error("Error patching CertidoesSection.tsx", e);
}


// Patch SalesLinksSection.tsx
try {
    let linksCode = fs.readFileSync('components/SalesLinksSection.tsx', 'utf8');
    const linkSearch = `        {
            title: "Fazenda Canoa",
            url: "https://fazendacanoa.com.br/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            )
        }
    ];`;

    const linkReplace = `        {
            title: "Fazenda Canoa",
            url: "https://fazendacanoa.com.br/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            )
        },
        {
            title: "SAEC (Certidão Matrícula/Ônus)",
            url: "https://ridigital.org.br/Acesso.aspx",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        }
    ];`;

    if (linksCode.includes(linkSearch)) {
        linksCode = linksCode.replace(linkSearch, linkReplace);
        fs.writeFileSync('components/SalesLinksSection.tsx', linksCode);
        console.log("Patched SalesLinksSection.tsx successfully.");
    } else {
        console.log("Could not find link array in SalesLinksSection.tsx");
    }
} catch(e) {
    console.error("Error patching SalesLinksSection.tsx", e);
}
