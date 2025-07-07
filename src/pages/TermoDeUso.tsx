import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermosDeUso = () => {
    return (
        <div className="bg-white">
            <Navbar />
            <main className="pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose lg:prose-lg">
                    <h1 className="text-center">Termos de Uso e Política de Privacidade do Direto no Ponto</h1>

                    <p className="lead text-center">
                        Bem-vindo(a) ao Direto no Ponto! Estes Termos de Uso e Política de Privacidade regem o uso desta plataforma de cursos e materiais resumidos para concursos públicos. Ao acessar ou usar o site, o usuário concorda com estes Termos.
                    </p>

                    <h2>1. Aceitação dos Termos</h2>
                    <p>Ao criar uma conta, acessar ou utilizar qualquer parte do Direto no Ponto, o usuário declara ter lido, compreendido e concordado em cumprir integralmente estes Termos. A não concordância com qualquer parte destes Termos impede a utilização da plataforma.</p>

                    <h2>2. Serviços Oferecidos</h2>
                    <p>O Direto no Ponto é uma plataforma online que oferece:</p>
                    <ul>
                        <li><strong>Cursos:</strong> Conteúdo didático aprofundado sobre diversas áreas de concursos públicos.</li>
                        <li><strong>Materiais Resumidos:</strong> Dicas, apostilas e resumos otimizados para o estudo.</li>
                        <li><strong>Ferramentas de Estudo:</strong> Recursos adicionais para auxiliar na preparação.</li>
                    </ul>

                    <h2>3. Cadastro e Informações do Usuário</h2>
                    <p>Para acessar os serviços do Direto no Ponto, o usuário poderá se cadastrar fornecendo as seguintes informações:</p>
                    <ul>
                        <li><strong>Nome Completo:</strong> Nome e sobrenome do usuário.</li>
                        <li><strong>Número de Celular com DDD:</strong> Para comunicação e contato.</li>
                        <li><strong>E-mail de Preferência:</strong> Para envio de comunicações, atualizações e informações.</li>
                        <li><strong>Área de Interesse em Concursos:</strong> Ex: Fiscal, Educacional, Saúde, etc., para personalizar a experiência e as ofertas.</li>
                        <li><strong>CPF:</strong> Para fins de identificação, emissão de notas fiscais e validação de pagamentos.</li>
                    </ul>
                    <p>O usuário pode optar por conectar sua conta Google para facilitar o cadastro. Ao fazer isso, o usuário autoriza o acesso e a coleta das informações básicas do seu perfil Google, como nome, e-mail e outras informações publicamente disponíveis no perfil, conforme permitido pelas configurações de privacidade do Google.</p>
                    <p>O usuário se compromete a fornecer informações verdadeiras, precisas, completas e atualizadas no seu cadastro e a mantê-las sempre atualizadas. O Direto no Ponto não se responsabiliza por dados incorretos ou desatualizados fornecidos pelos usuários.</p>

                    <h2>4. Coleta e Uso de Dados Pessoais</h2>
                    <p>A privacidade do usuário é fundamental para o Direto no Ponto. Os dados pessoais são coletados com as seguintes finalidades:</p>
                    <ul>
                        <li><strong>Fornecimento e Melhoria dos Serviços:</strong> Para operar, manter, proteger e melhorar a plataforma e os serviços oferecidos.</li>
                        <li><strong>Comunicação:</strong> Para enviar e-mails, notificações e outras comunicações relacionadas aos serviços, conta, promoções e novidades.</li>
                        <li><strong>Personalização:</strong> Para personalizar a experiência na plataforma, oferecendo conteúdo e recomendações de acordo com as áreas de interesse do usuário.</li>
                        <li><strong>Análise e Estatísticas:</strong> Para entender como os usuários utilizam a plataforma e para fins de pesquisa e desenvolvimento.</li>
                        <li><strong>Marketing e Publicidade:</strong> As informações dos usuários que adquirirem cursos serão armazenadas no banco de dados com uma tag específica para esse público. Este armazenamento tem função comercial e de publicidade, sendo utilizado para futuras propagandas, e-mails promocionais, ofertas especiais e qualquer forma de propagação e comunicação promocional relacionada aos produtos e serviços.</li>
                        <li><strong>Destaque em Casos de Sucesso:</strong> Em caso de sucesso do usuário em algum concurso público, ou qualquer tipo de ato bem-sucedido nas etapas do concurso em que o material do Direto no Ponto tenha sido um diferencial, o usuário autoriza o uso de sua imagem e nome completo para divulgações promocionais e de publicidade do curso. Nosso objetivo é inspirar outros estudantes com sua jornada e sucesso, e essa divulgação será feita com total respeito, sem intenção de prejudicar, humilhar ou enganar o usuário. Valorizamos a colaboração e as histórias reais de superação, e poderemos convidar o usuário a dar depoimentos ou gravar vídeos de entrevistas, caso se sinta confortável em compartilhar sua experiência.</li>
                        <li><strong>Cumprimento Legal:</strong> Para cumprir obrigações legais e regulatórias.</li>
                    </ul>

                    <h2>5. Processamento de Pagamentos e Segurança dos Dados</h2>
                    <p>Para processar as transações de compra de cursos e materiais, o Direto no Ponto utiliza a plataforma de pagamentos Pagar.me. Ao realizar um pagamento, o usuário concorda com os termos e políticas de privacidade específicos do Pagar.me, que podem ser consultados diretamente no site deles.</p>
                    <p>O Pagar.me é uma solução de pagamentos digitais da Stone, conhecida por sua robustez e segurança. As informações de pagamento são processadas diretamente pelo Pagar.me, que garante a proteção dos dados sensíveis do usuário através das seguintes medidas: </p>
                    <ul>
                        <li><strong>Certificação PCI DSS Nível 1:</strong> O Pagar.me é certificado com o mais alto nível do Padrão de Segurança de Dados da Indústria de Cartões de Pagamento (PCI DSS), o que significa que ele segue rigorosos requisitos para proteger dados de cartão de crédito.</li>
                        <li><strong>Criptografia:</strong> Todas as transações e dados de cartão são criptografados, garantindo que as informações financeiras dos usuários estejam seguras durante a transmissão.</li>
                        <li><strong>Tecnologias Antifraude:</strong> O Pagar.me utiliza sistemas antifraude avançados para identificar e prevenir transações suspeitas, protegendo tanto o usuário quanto o <strong>Direto no Ponto</strong> contra fraudes. </li>
                        <li><strong>Tokenização:</strong> Para pagamentos com cartão, os dados sensíveis podem ser convertidos em "tokens" (códigos alfanuméricos únicos), o que reduz a exposição das informações originais do cartão em transações futuras. </li>
                    </ul>

                    <p><strong>Formas de Pagamento Aceitas:</strong></p>
                    <p>Através do Pagar.me, o Direto no Ponto oferece diversas opções para que o usuário realize
                        seus pagamentos com comodidade e segurança, incluindo: </p>
                    <ul>
                        <li><strong>Cartão de Crédito:</strong> Aceitamos as principais bandeiras, com a possibilidade de
                            parcelamento. Os dados coletados para esta modalidade incluem número do cartão,
                            nome do titular, data de validade e código de segurança (CVV).</li>
                        <li><strong>Cartão de Débito:</strong> Permite a dedução do valor da compra diretamente da conta
                            bancária do usuário.</li>
                        <li><strong>PIX:</strong> Pagamento instantâneo, rápido e seguro.</li>
                        <li><strong>Boleto Bancário:</strong> O usuário pode gerar um boleto para pagamento em bancos ou
                            lotéricas.</li>
                        <li>Outras formas de pagamento que possam ser disponibilizadas pelo Pagar.me no
                            futuro.</li>
                    </ul>
                    <p>É importante ressaltar que o <strong>Direto no Ponto</strong> não armazena diretamente dados sensíveis
                        de pagamento, como números completos de cartão de crédito. Essas informações são
                        coletadas e processadas com segurança pelo Pagar.me, agindo como intermediador da
                        transação.</p>

                    <h2>6. Prazo de Arrependimento (Direito de Desistência)</h2>
                    <p>Em conformidade com o Art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), o
                        usuário que adquirir cursos ou materiais digitais do Direto no Ponto fora do
                        estabelecimento comercial (ou seja, online) tem o direito de desistir da compra no prazo de 7
                        (sete) dias corridos, contados a partir da data de efetivação da compra ou do recebimento
                        do produto ou serviço. </p>
                    <p>Para exercer o direito de desistência, o usuário deverá comunicar sua decisão ao Direto
                        no Ponto dentro do prazo legal, através do nosso principal canal de contato, o correio
                        eletrônico (e-mail):dflensinoltda@gmail.com</p>
                    <p>Após a comunicação, o Direto no Ponto providenciará o reembolso integral do valor pago.
                    </p>
                    <p>A avaliação sobre o consumo e a elegibilidade para reembolso será feita pelo Direto no
                        Ponto de forma razoável e justa, buscando sempre a boa-fé de ambas as partes. </p>

                    <h2>7. Compartilhamento de Dados</h2>
                    <p>O Direto no Ponto não vende, aluga ou compartilha dados pessoais com terceiros não
                        afiliados, exceto nas seguintes situações:
                    </p>
                    <ul>
                        <li><strong>Provedores de Serviços:</strong> Dados podem ser compartilhados com empresas que
                            auxiliam na prestação dos serviços (ex: processadores de pagamento como o
                            Pagar.me, serviços de e-mail marketing, provedores de hospedagem), sempre sob
                            acordos de confidencialidade.</li>
                        <li><strong>Obrigações Legais:</strong>Se houver obrigação por lei, ordem judicial ou processo legal
                            de divulgar informações.</li>
                        <li><strong>Proteção de Direitos:</strong>Para proteger os direitos, propriedade ou segurança do
                            Direto no Ponto, de seus usuários ou do público.</li>
                    </ul>

                    <h2>8. Armazenamento e Segurança de Dados</h2>
                    <p>O <strong>Direto no Ponto</strong> emprega diversas medidas de segurança técnicas e administrativas
                        efetivas para proteger as informações pessoais contra acesso não autorizado, uso indevido,
                        alteração ou destruição. Os dados são armazenados em servidores seguros, localizados no
                        Brasil. </p>

                    <h2>9. Direitos do Titular dos Dados</h2>
                    <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), o
                        usuário possui os seguintes direitos em relação aos seus dados pessoais:</p>
                    <ul>
                        <li><strong>Acesso:</strong> Solicitar informações sobre quais dados pessoais são mantidos.</li>
                        <li><strong>Retificação:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
                        <li><strong>Exclusão:</strong> Solicitar a exclusão de dados pessoais (sujeito a certas condições e
                            obrigações legais).</li>
                        <li><strong>Anonimização/Bloqueio:</strong> Solicitar a anonimização, bloqueio ou eliminação de dados
                            desnecessários ou excessivos.</li>
                        <li><strong>Revogação do Consentimento</strong> Revogar o consentimento a qualquer momento
                            para o tratamento de dados (isso não afetará a legalidade do tratamento baseado no
                            consentimento antes de sua revogação).</li>
                        <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados para outro fornecedor de serviço
                            ou produto.</li>
                        <li><strong>Informação:</strong> Ser informado sobre as entidades públicas e privadas com as quais o <strong>Direto no Ponto</strong> realizou uso compartilhado de dados.</li>
                    </ul>
                    <p>Para exercer qualquer um desses direitos, o usuário pode entrar em contato através do
                        e-mail: dflensinoltda@gmail.com</p>

                    <h2>10. Cookies e Tecnologias Semelhantes</h2>
                    <p>São utilizados cookies e outras tecnologias de rastreamento para melhorar a experiência na
                        plataforma, analisar o tráfego do site, personalizar conteúdo e anúncios, e para fins de
                        marketing. O usuário pode configurar seu navegador para recusar cookies, mas isso pode
                        limitar a funcionalidade de algumas partes do site.</p>

                    <h2>11. Links para Terceiros</h2>
                    <p>O site pode conter links para sites de terceiros. O <strong>Direto no Ponto</strong> não se responsabiliza
                        pelas práticas de privacidade ou conteúdo desses sites. Recomenda-se que o usuário leia
                        os termos e políticas de privacidade de qualquer site de terceiros visitado. </p>

                    <h2>12. Propriedade Intelectual e Restrições de Uso</h2>
                    <p>Todo o conteúdo disponível no <strong>Direto no Ponto</strong>, incluindo textos, vídeos, materiais
                        didáticos, logotipos, gráficos e software, é de propriedade exclusiva do <strong>Direto no Ponto</strong> ou
                        de seus licenciadores e é protegido por leis de direitos autorais e propriedade intelectual. </p>
                    <p><strong>É estritamente proibido:</strong></p>
                    <ul>
                        <li><strong>Pirataria e Repasse Ilegal:</strong> Copiar, reproduzir, distribuir, publicar, exibir, executar,
                            modificar ou criar trabalhos derivados de qualquer conteúdo sem permissão
                            expressa por escrito. Isso inclui, mas não se limita a, download e distribuição de
                            materiais protegidos por direitos autorais, sem a devida autorização.</li>
                        <li><strong>Rateio de Cursos e Compartilhamento de Contas:</strong> O acesso à plataforma e aos
                            cursos é pessoal e intransferível. É proibido o <strong>rateio de cursos</strong>, o
                            <strong>compartilhamento de senhas</strong> ou credenciais de acesso, e qualquer forma de
                            <strong>compartilhamento de contas/</strong> com terceiros. A detecção de tais práticas resultará
                            na suspensão ou encerramento imediato da conta do usuário, sem direito a
                            reembolso, e poderá sujeitar o infrator às medidas legais cabíveis.</li>
                        <li><strong>Qualquer outra forma de uso ilegal ou não autorizado do conteúdo ou da
                            plataforma.</strong></li>
                    </ul>
                    <p>O <strong>Direto no Ponto</strong> se reserva o direito de tomar as medidas legais apropriadas para
                        proteger seus direitos de propriedade intelectual e combater a pirataria e o uso indevido de
                        seus materiais.</p>

                    <h2>13. Conduta do Usuário</h2>
                    <p>Ao utilizar o <strong>Direto no Ponto</strong>, o usuário concorda em não:</p>
                    <ul>
                        <li>Utilizar a plataforma para qualquer finalidade ilegal ou não autorizada.</li>
                        <li>Violar quaisquer leis locais, estaduais, nacionais ou internacionais.</li>
                        <li>Interferir ou interromper a segurança da plataforma ou abusar dos serviços, recursos
                            do sistema, contas de rede, servidores ou redes conectadas ou acessíveis através
                            da plataforma.</li>
                        <li>Enviar spam, correntes, ou qualquer forma de comunicação não solicitada.</li>
                        <li>Tentar obter acesso não autorizado a contas de outros usuários.</li>
                        <li>Publicar conteúdo ofensivo, difamatório, obsceno, discriminatório ou que viole os
                            direitos de terceiros.</li>
                    </ul>

                    <h2>14. Alterações nestes Termos</h2>
                    <p>O <strong>Direto no Ponto</strong> reserva-se o direito de modificar estes Termos a qualquer momento.
                        Quaisquer alterações serão publicadas nesta página com a data da última atualização.
                        Recomenda-se que o usuário revise estes Termos periodicamente para se manter informado
                        sobre as práticas. O uso continuado da plataforma após a publicação das alterações
                        constitui aceitação dos novos Termos.</p>

                    <h2>15. Rescisão</h2>
                    <p>O acesso à plataforma pode ser suspenso ou encerrado, a critério exclusivo do <strong>Direto no
                        Ponto</strong>, sem aviso prévio, em caso de violação destes Termos ou por qualquer outro motivo.</p>

                    <h2>16. Contato</h2>
                    <p>Para dúvidas sobre estes Termos ou as práticas de privacidade, entre em contato através do e-mail: dflensinoltda@gmail.com.</p>
                    <p><em>Última atualização: 19 de junho de 2025.</em></p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermosDeUso;