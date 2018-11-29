/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const ArtifactScores = app.model.define('artifact_scores', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    artifactId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    scorerId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    score: {
      type: INTEGER,
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'artifact_scores'
  });

  ArtifactScores.listArtifactScores = async function ({
    offset = 0,
    limit = 10
  }) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc'],
        ['Id', 'desc']
      ]
    });
  }

  ArtifactScores.findByArtifactIdWithPage = async function ({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        artifactId: artifactId,
      }
    });
  }

  ArtifactScores.findByArtifactIdAndScorerId = async function ({
    scorerId = 0,
    artifactId = 0
  }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        artifactId: artifactId,
      }
    });
  }

  ArtifactScores.createArtifactScores = async function (artifactScores) {
    return this.create(artifactScores);
  }

  ArtifactScores.updateScore = async function ({
    artifactId = 0,
    scorerId = 0,
    score = 0
  }) {
    const artifactScores = await this.findByArtifactIdAndScorerId(scorerId,artifactId);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.update({
      score: score
    }, {
      where: {
        artifactId: artifactId,
        scorerId: scorerId
      }
    });
  }

  ArtifactScores.delArtifactScores = async function (Id) {
    const artifact = await this.findById(Id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.destroy();
  }

  return ArtifactScores;
};
