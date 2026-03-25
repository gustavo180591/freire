# 🏗️ **INFRAESTRUCTURA_PRODUCCION.md**
# Arquitectura de Producción y Operaciones
Instituto Superior de Formación Docente – Paulo Freire

---

## 📋 **Visión General**

Infraestructura de producción enterprise-grade diseñada para garantizar alta disponibilidad, seguridad, escalabilidad y resiliencia del Sistema Integral de Gestión Académica del Instituto Paulo Freire.

---

## 🖥️ **Infraestructura de Servidores**

### **🏢 Arquitectura de Producción**

```mermaid
graph TB
    subgraph "Internet"
        LB[Load Balancer Nginx]
        CDN[CDN CloudFlare]
    end
    
    subgraph "DMZ Zone"
        FW[Firewall UTM]
        WAF[Web Application Firewall]
    end
    
    subgraph "Application Servers"
        APP1[NestJS App Server 1]
        APP2[NestJS App Server 2]
        APP3[NestJS App Server 3]
    end
    
    subgraph "Database Layer"
        PG_MASTER[PostgreSQL Master]
        PG_REPLICA[PostgreSQL Replica]
        REDIS_CLUSTER[Redis Cluster]
    end
    
    subgraph "Storage Layer"
        S3_STORAGE[Object Storage S3]
        NFS_SHARE[NFS Share]
    end
    
    subgraph "Monitoring & Logging"
        PROMETHEUS[Prometheus]
        GRAFANA[Grafana]
        ELK_STACK[ELK Stack]
    end
    
    CDN --> LB
    LB --> FW
    FW --> WAF
    WAF --> APP1
    WAF --> APP2
    WAF --> APP3
    
    APP1 --> PG_MASTER
    APP2 --> PG_MASTER
    APP3 --> PG_MASTER
    
    APP1 --> PG_REPLICA
    APP2 --> PG_REPLICA
    APP3 --> PG_REPLICA
    
    APP1 --> REDIS_CLUSTER
    APP2 --> REDIS_CLUSTER
    APP3 --> REDIS_CLUSTER
    
    APP1 --> S3_STORAGE
    APP2 --> S3_STORAGE
    APP3 --> S3_STORAGE
    
    APP1 --> NFS_SHARE
    APP2 --> NFS_SHARE
    APP3 --> NFS_SHARE
    
    APP1 --> PROMETHEUS
    APP2 --> PROMETHEUS
    APP3 --> PROMETHEUS
    
    PG_MASTER --> PROMETHEUS
    REDIS_CLUSTER --> PROMETHEUS
```

### **🖥️ Servidores Backend**

#### **Servidores de Aplicación**
```yaml
# Servidores NestJS (3 instancias)
app_servers:
  specs:
    cpu: 4 vCPU
    ram: 8GB RAM
    storage: 100GB SSD
    os: Ubuntu 22.04 LTS
  
  configuration:
    - Node.js 18.x
    - PM2 Process Manager
    - Nginx Reverse Proxy
    - Log Rotation
    - Health Checks
  
  networking:
    internal_ip: 10.0.1.x
    load_balancer: enabled
    ssl_termination: true
```

#### **Base de Datos PostgreSQL**
```yaml
# PostgreSQL Master-Slave
postgresql:
  master:
    cpu: 8 vCPU
    ram: 16GB RAM
    storage: 500GB SSD
    version: PostgreSQL 14.x
    configuration:
      max_connections: 200
      shared_buffers: 4GB
      effective_cache_size: 12GB
      work_mem: 64MB
      maintenance_work_mem: 256MB
  
  replica:
    cpu: 4 vCPU
    ram: 8GB RAM
    storage: 500GB SSD
    replication: streaming
    lag_tolerance: < 1s
```

#### **Redis Cache Cluster**
```yaml
# Redis Cluster para cache y sesiones
redis:
  cluster:
    nodes: 3
    cpu_per_node: 2 vCPU
    ram_per_node: 4GB RAM
    storage_per_node: 50GB SSD
    version: Redis 7.x
    
  configuration:
    maxmemory: 2GB
    eviction_policy: allkeys-lru
    persistence: RDB + AOF
    cluster_enabled: true
    
  usage:
    - Session storage
    - Application cache
    - Rate limiting
    - Message broker
```

### **📁 Storage de Archivos**

#### **Object Storage Principal**
```yaml
# AWS S3 Compatible Storage
object_storage:
  provider: AWS S3 / MinIO
  bucket: freire-institucional-files
  
  configuration:
    versioning: enabled
    encryption: AES-256
    access_logging: enabled
    lifecycle_policy:
      - transition_to_ia_after_30_days
      - transition_to_glacier_after_90_days
      - delete_after_7_years
  
  usage:
    - Documentos estudiantiles
    - Actas digitales
    - Materiales didácticos
    - Backups de documentos
    - Fotos institucionales
```

#### **Network Attached Storage**
```yaml
# NFS Share para archivos temporales
nas_storage:
  capacity: 1TB
  configuration:
    raid_level: RAID 10
    backup_policy: daily_snapshot
    access_protocol: NFSv4
    encryption: at_rest
  
  usage:
    - Temporary uploads
    - Processing files
    - Log files
    - System backups
```

---

## 🔐 **Seguridad de Producción**

### **🛡️ Seguridad de Red**

#### **Firewall y WAF**
```yaml
# Configuración de Seguridad
network_security:
  firewall:
    type: Next-Generation UTM
    features:
      - Stateful packet inspection
      - Intrusion Prevention (IPS)
      - Application Layer Filtering
      - DDoS Protection
    
    rules:
      - allow: 80/tcp, 443/tcp (HTTP/HTTPS)
      - allow: 22/tcp (SSH - restricted IPs)
      - deny: all other inbound
      - allow: all outbound
  
  web_application_firewall:
    type: ModSecurity / Cloud WAF
    rulesets:
      - OWASP Top 10
      - Custom rules for educational systems
    protection:
      - SQL Injection
      - XSS Protection
      - File Upload Validation
      - Rate Limiting per IP
```

#### **Segmentación de Red**
```yaml
# Segmentos de Red
network_segments:
  dmz_zone:
    - Load Balancer
    - Web Application Firewall
    - CDN Edge
  
  application_zone:
    - App Servers
    - Redis Cluster
    - Internal APIs
  
  database_zone:
    - PostgreSQL Master/Replica
    - Backup Storage
  
  management_zone:
    - Monitoring Tools
    - Admin Access
    - CI/CD Runners
```

### **🔑 Seguridad de Aplicación**

#### **HTTPS y Certificados**
```yaml
# Configuración SSL/TLS
ssl_configuration:
  certificates:
    provider: Let's Encrypt / DigiCert
    auto_renewal: true
    monitoring: expiring_soon_alerts
  
  protocols:
    enabled: TLS 1.2, TLS 1.3
    disabled: TLS 1.0, TLS 1.1, SSL 3.0
  
  ciphers:
    - ECDHE-RSA-AES256-GCM-SHA384
    - ECDHE-RSA-CHACHA20-POLY1305
    - ECDHE-RSA-AES128-GCM-SHA256
  
  headers:
    Strict-Transport-Security: "max-age=31536000; includeSubDomains"
    X-Frame-Options: "DENY"
    X-Content-Type-Options: "nosniff"
    Content-Security-Policy: "default-src 'self'"
```

#### **JWT y Control de Acceso**
```yaml
# Configuración de Seguridad JWT
jwt_security:
  algorithm: RS256
  key_rotation: every_90_days
  token_lifetime:
    access_token: 1_hour
    refresh_token: 7_days
  
  security_measures:
    - Token blacklisting (Redis)
    - Rate limiting per user
    - Device fingerprinting
    - Concurrent session limits
  
  access_control:
    - Role-Based Access Control (RBAC)
    - Attribute-Based Access Control (ABAC)
    - Resource-level permissions
    - API rate limiting
```

### **🔍 Monitoreo de Seguridad**

#### **SIEM y Alertas**
```yaml
# Security Information and Event Management
security_monitoring:
  siem:
    platform: ELK Stack / Splunk
    log_sources:
      - Application logs
      - Web server logs
      - Database logs
      - Firewall logs
      - System logs
  
  alerts:
    - Failed login attempts (> 5/min)
    - Privilege escalation attempts
    - Data access anomalies
    - Unusual file access patterns
    - Certificate expiration warnings
  
  compliance:
    - Data retention policies
    - Access audit trails
    - GDPR compliance (if applicable)
    - Educational data protection
```

---

## 🚀 **DevOps y Automatización**

### **🐳 Docker y Contenerización**

#### **Docker Configuration**
```dockerfile
# Dockerfile para producción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]
```

#### **Docker Compose Producción**
```yaml
version: '3.8'
services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/freire
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:14-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: freire
      POSTGRES_USER: freire_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### **🔄 CI/CD Pipeline**

#### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run security:audit

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: |
          docker build -t freire-api:${{ github.sha }} .
          docker tag freire-api:${{ github.sha }} freire-api:latest
      - name: Push to registry
        run: |
          docker push ${{ secrets.REGISTRY_URL }}/freire-api:${{ github.sha }}
          docker push ${{ secrets.REGISTRY_URL }}/freire-api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Blue-Green Deployment
          ./scripts/blue-green-deploy.sh ${{ github.sha }}
      - name: Health check
        run: |
          ./scripts/health-check.sh
      - name: Rollback if needed
        if: failure()
        run: |
          ./scripts/rollback.sh
```

#### **Deploy Automático**
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

NEW_VERSION=$1
CURRENT_ENV=$(kubectl get service freire-api -o jsonpath='{.spec.selector.version}')

echo "Deploying version $NEW_VERSION..."

# Create new deployment
kubectl apply -f k8s/deployment-$NEW_VERSION.yaml

# Wait for new pods to be ready
kubectl wait --for=condition=ready pod -l version=$NEW_VERSION --timeout=300s

# Health check
if ./scripts/health-check.sh $NEW_VERSION; then
    echo "Health check passed, switching traffic..."
    kubectl patch service freire-api -p '{"spec":{"selector":{"version":"'$NEW_VERSION'"'"}}}'
    echo "Traffic switched to $NEW_VERSION"
    
    # Clean up old deployment
    kubectl delete deployment freire-api-$CURRENT_ENV
else
    echo "Health check failed, rolling back..."
    kubectl delete deployment freire-api-$NEW_VERSION
    exit 1
fi
```

---

## 💾 **Estrategia de Backups**

### **🗄️ Backup de Base de Datos**

#### **PostgreSQL Backup Strategy**
```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="freire_db_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full backup with compression
pg_dump -h localhost -U freire_user -d freire \
  --format=custom \
  --compress=9 \
  --verbose \
  --file=$BACKUP_DIR/$BACKUP_FILE

# Verify backup
pg_restore --list $BACKUP_DIR/$BACKUP_FILE > /dev/null
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/$BACKUP_FILE s3://freire-backups/database/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

# Create backup verification
pg_restore --list $BACKUP_DIR/$BACKUP_FILE > $BACKUP_DIR/${BACKUP_FILE}_verify.log
```

#### **Point-in-Time Recovery**
```yaml
# Continuous Archiving
postgresql_archiving:
  wal_level: replica
  archive_mode: on
  archive_command: 'cp %p /backups/postgresql/wal/%f'
  archive_timeout: 60
  max_wal_senders: 3
  
  # PITR Configuration
  recovery_target_time: "2024-03-15 10:30:00"
  restore_command: 'cp /backups/postgresql/wal/%f %p'
```

### **📁 Backup de Documentos**

#### **Object Storage Backup**
```bash
#!/bin/bash
# scripts/backup-documents.sh

SOURCE_BUCKET="freire-institucional-files"
BACKUP_BUCKET="freire-backups-documents"
DATE=$(date +%Y%m%d_%H%M%S)

# Sync to backup bucket
aws s3 sync s3://$SOURCE_BUCKET/ s3://$BACKUP_BUCKET/$DATE/ \
  --delete \
  --storage-class GLACIER \
  --exclude "*.tmp" \
  --exclude "*.cache"

# Create backup manifest
aws s3 ls --recursive s3://$BACKUP_BUCKET/$DATE/ > \
  /backups/documents/manifest_$DATE.txt

# Verify backup
BACKUP_SIZE=$(aws s3 ls --summarize --human-readable --recursive s3://$BACKUP_BUCKET/$DATE/ | tail -1)
echo "Backup completed: $BACKUP_SIZE"
```

#### **Versioning and Retention**
```yaml
# Backup Retention Policy
retention_policy:
  daily_backups:
    retention: 30_days
    storage_class: STANDARD
  
  weekly_backups:
    retention: 12_weeks
    storage_class: INFREQUENT_ACCESS
  
  monthly_backups:
    retention: 12_months
    storage_class: GLACIER
  
  yearly_backups:
    retention: 7_years
    storage_class: DEEP_ARCHIVE
```

### **🔄 Backup Automatizado**

#### **Cron Jobs Schedule**
```bash
# Crontab para backups automáticos
# /etc/cron.d/freire-backups

# Backup de base de datos diario a las 2 AM
0 2 * * * freire /opt/freire/scripts/backup-database.sh

# Backup de documentos semanal los domingos a las 3 AM
0 3 * * 0 freire /opt/freire/scripts/backup-documents.sh

# Verificación de backups diarios a las 6 AM
0 6 * * * freire /opt/freire/scripts/verify-backups.sh

# Limpieza de backups antiguos los domingos a las 4 AM
0 4 * * 0 freire /opt/freire/scripts/cleanup-old-backups.sh
```

#### **Backup Verification**
```bash
#!/bin/bash
# scripts/verify-backups.sh

BACKUP_DIR="/backups"
TODAY=$(date +%Y%m%d)
ALERT_EMAIL="admin@paulofreire.edu"

# Verificar backup de base de datos
DB_BACKUP=$(find $BACKUP_DIR/postgresql -name "*$TODAY*.sql" | wc -l)
if [ $DB_BACKUP -eq 0 ]; then
    echo "ERROR: Database backup missing for $TODAY" | \
    mail -s "Backup Alert - Database" $ALERT_EMAIL
fi

# Verificar backup de documentos
DOC_BACKUP=$(aws s3 ls s3://freire-backups-documents/ | grep $TODAY | wc -l)
if [ $DOC_BACKUP -eq 0 ]; then
    echo "ERROR: Document backup missing for $TODAY" | \
    mail -s "Backup Alert - Documents" $ALERT_EMAIL
fi

# Verificar integridad
for backup in $(find $BACKUP_DIR -name "*.sql" -mtime -1); do
    if ! pg_restore --list $backup > /dev/null 2>&1; then
        echo "ERROR: Corrupted backup: $backup" | \
        mail -s "Backup Alert - Corrupted" $ALERT_EMAIL
    fi
done
```

---

## 📊 **Monitoreo y Observabilidad**

### **📈 Métricas de Producción**

#### **Application Metrics**
```yaml
# Métricas a monitorear
application_metrics:
  performance:
    - response_time_p95 < 200ms
    - response_time_p99 < 500ms
    - throughput > 1000 req/min
    - error_rate < 0.1%
  
  availability:
    - uptime > 99.5%
    - health_check_success > 99.9%
    - database_connection_success > 99.8%
  
  business:
    - active_users > 500
    - daily_logins > 800
    - successful_inscriptions > 95%
    - payment_processing_success > 99%
```

#### **Infrastructure Metrics**
```yaml
# Métricas de infraestructura
infrastructure_metrics:
  servers:
    - cpu_usage < 80%
    - memory_usage < 85%
    - disk_usage < 90%
    - network_latency < 10ms
  
  database:
    - connection_pool_usage < 80%
    - query_time_p95 < 100ms
    - replication_lag < 1s
    - transaction_rate > 1000/min
  
  cache:
    - hit_rate > 90%
    - memory_usage < 80%
    - eviction_rate < 5%
    - connection_count < 1000
```

### **🔍 Alerting y Notificaciones**

#### **Alert Configuration**
```yaml
# Configuración de alertas
alerts:
  critical:
    - service_down: immediate_notification
    - database_connection_lost: immediate_notification
    - disk_space_90%: immediate_notification
    - security_breach: immediate_notification
  
  warning:
    - high_response_time: notification_after_5min
    - memory_usage_80%: notification_after_10min
    - backup_failure: notification_after_1hour
    - certificate_expiring_30days: notification_daily
  
  info:
    - deployment_completed: notification
    - backup_successful: notification
    - high_traffic_detected: notification
```

---

## 🎯 **Capacidad y Escalabilidad**

### **📊 Capacity Planning**

#### **Current Capacity**
```yaml
# Capacidad actual
current_capacity:
  users:
    concurrent: 1000
    total_registered: 5000
    daily_active: 800
  
  transactions:
    per_second: 50
    per_minute: 3000
    per_hour: 180000
  
  storage:
    database: 50GB
    documents: 200GB
    backups: 100GB
```

#### **Scaling Strategy**
```yaml
# Estrategia de escalado
scaling_strategy:
  horizontal_scaling:
    - auto_scale_app_servers: 1-10 instances
    - auto_scale_database: read replicas
    - auto_scale_redis: cluster mode
  
  vertical_scaling:
    - cpu_upgrade_path: 4→8→16 vCPU
    - memory_upgrade_path: 8→16→32GB RAM
    - storage_upgrade_path: 100→500→1000GB SSD
  
  triggers:
    - cpu_usage > 70% for 5min
    - memory_usage > 80% for 3min
    - response_time_p95 > 300ms
    - queue_depth > 100
```

---

## 🚨 **Plan de Recuperación de Desastres**

### **🔄 RTO y RPO**

#### **Recovery Objectives**
```yaml
# Objetivos de recuperación
recovery_objectives:
  RTO_Recovery_Time_Objective:
    critical_services: 4_hours
    important_services: 8_hours
    non_critical_services: 24_hours
  
  RPO_Recovery_Point_Objective:
    database: 1_hour
    documents: 24_hours
    configurations: 15_minutes
```

#### **Disaster Recovery Plan**
```yaml
# Plan de recuperación de desastres
disaster_recovery:
  primary_site:
    location: "Data Center Principal"
    services: "All production services"
  
  secondary_site:
    location: "Cloud Provider (AWS/Azure)"
    services: "Critical services only"
    activation: "Manual within 2 hours"
  
  backup_site:
    location: "Different geographic region"
    services: "Database and documents only"
    activation: "Manual within 24 hours"
```

---

## 📋 **Checklist de Producción**

### **🔍 Pre-Deployment Checklist**
```markdown
- [ ] Backup completo realizado
- [ ] Tests de estrés ejecutados
- [ ] Security audit completado
- [ ] Certificados SSL verificados
- [ ] Configuración de monitoreo validada
- [ ] Plan de rollback preparado
- [ ] Comunicación a stakeholders enviada
- [ ] Ventana de mantenimiento coordinada
```

### **✅ Post-Deployment Verification**
```markdown
- [ ] Health checks pasando
- [ ] Base de datos conectada
- [ ] Cache funcionando
- [ ] API endpoints respondiendo
- [ ] Autenticación funcionando
- [ ] Documentos accesibles
- [ ] Monitoreo capturando métricas
- [ ] Alertas configuradas
- [ ] Performance dentro de límites
```

---

*Esta infraestructura de producción garantiza alta disponibilidad, seguridad y escalabilidad para el Sistema Integral de Gestión Académica del Instituto Paulo Freire.*
