const DOMParser = require('xmldom').DOMParser;

const xmlString = `
<Imoveis>
    <Imovel>
        <CodigoImovel>JT123</CodigoImovel>
        <TipoImovel>Apartamento</TipoImovel>
        <Bairro>Centro</Bairro>
        <PrecoVenda>1000000</PrecoVenda>
    </Imovel>
</Imoveis>
`;

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, "text/xml");
let imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
console.log("Imoveis count:", imoveis.length);
