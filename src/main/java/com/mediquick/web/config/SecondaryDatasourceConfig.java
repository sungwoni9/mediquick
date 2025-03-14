package com.mediquick.web.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(basePackages = "com.mediquick.web.secondary", entityManagerFactoryRef = "secondaryEntityManager", transactionManagerRef = "secondaryTransactionManager")
@EnableTransactionManagement
class SecondaryDatasourceConfig {

    @Value("${spring.datasource.secondary.url}")
    private String url;

    @Value("${spring.datasource.secondary.username}")
    private String username;

    @Value("${spring.datasource.secondary.password}")
    private String password;

    @Value("${spring.datasource.secondary.driver-class-name}")
    private String driverClassName;


    @Bean(name = "secondaryDataSource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().url(url).username(username).password(password).driverClassName(driverClassName).build();
    }

    @Bean(name = "secondaryEntityManager")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(true);

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("com.mediquick.web.secondary");
        factory.setDataSource(dataSource());

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "none");
        properties.put("hibernate.show_sql", false);
        properties.put("hibernate.format_sql", true);

        factory.setJpaPropertyMap(properties);

        return factory;
    }

    @Bean(name = "secondaryTransactionManager")
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {

        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(entityManagerFactory);
        return txManager;
    }
}

